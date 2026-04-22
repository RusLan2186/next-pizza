import { hashSync } from "bcrypt";
import { prisma } from "./prisma-client";
import { categories, ingredients, products } from "./constants";
import { Prisma } from "@prisma/client";

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const generateProductItem = ({
  productId,
  pizzaType,
  size,
  price,
}: {
  productId: number;
  pizzaType?: 1 | 2;
  size?: 20 | 30 | 40;
  price?: number;
}) => {
  return {
    productId,
    price: price ?? randomNumber(5, 30),
    pizzaType,
    size,
  } as Prisma.ProductVariantUncheckedCreateInput;
};

const getIngredientsSlice = (start: number, end: number, pizzaName: string) => {
  const connect = ingredients
    .slice(start, end)
    .map((ingredient) => ({ id: ingredient.id }));

  if (connect.length === 0) {
    throw new Error(`Pizza ${pizzaName} must have at least one ingredient`);
  }

  return connect;
};

const otherProductsPrices: Record<string, number> = {
  "Caffè Latte": 7,
  "Ham & Cheese Sandwich": 9,
  "Classic Omelet": 8,
  "Cheese Omelet": 10,
  "Oven-Baked Potatoes with Sauce 🌱": 6,
  Dodster: 8,
  "Chicken Roll": 9,
  "Spicy Dodster": 10,
  Cupcakes: 7,
  "Rustic Potatoes": 7,
  "Banana Milkshake": 8,
  "Caramel Apple Milkshake": 9,
  "Berry Mojito": 8,
  "Mango Fizz": 8,
  "Caramel Cappuccino": 7,
  "Coconut Latte": 7,
  Americano: 6,
};

const pizzaBasePrices: Record<string, number> = {
  Pepperoni: 10,
  Margherita: 9,
  Hawaiian: 11,
  "BBQ Chicken": 12,
  "Four Cheese": 12,
  "Meat Lovers": 13,
};

const pizzaSizePriceDelta: Record<20 | 30 | 40, number> = {
  20: 0,
  30: 4,
  40: 8,
};

const pizzaTypePriceDelta: Record<1 | 2, number> = {
  1: 0,
  2: 1,
};

const pizzaVariantsByName: Partial<
  Record<string, Record<1 | 2, Array<20 | 30 | 40>>>
> = {
  // Example of custom dough/size matrix for a specific pizza
  Pepperoni: {
    1: [30, 40],
    2: [20, 30],
  },
  Margherita: {
    1: [20, 30, 40],
    2: [20, 30],
  },
};

const getPizzaVariantPrice = ({
  pizzaName,
  pizzaType,
  size,
}: {
  pizzaName: string;
  pizzaType: 1 | 2;
  size: 20 | 30 | 40;
}) => {
  const basePrice = pizzaBasePrices[pizzaName];

  if (!basePrice) {
    throw new Error(`Missing base price for pizza ${pizzaName}`);
  }

  return basePrice + pizzaSizePriceDelta[size] + pizzaTypePriceDelta[pizzaType];
};

// генерирует данные
async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: "User",
        email: "user@gmail.com",
        password: hashSync("12345678", 10),
        role: "USER",
        verified: new Date(),
      },

      {
        fullName: "Admin",
        email: "admin@gmail.com",
        password: hashSync("12345678", 10),
        role: "ADMIN",
        verified: new Date(),
      },
    ],
  });

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.ingredient.createMany({
    data: ingredients,
  });

  await prisma.product.createMany({
    data: products,
  });

  const pizza1 = await prisma.product.create({
    data: {
      productName: "Pepperoni",
      imageUrl: "/pizza/pizza-1.png",
      categoryId: 1,
      ingredients: {
        connect: getIngredientsSlice(0, 5, "Pepperoni"),
      },
    },
  });

  const pizza2 = await prisma.product.create({
    data: {
      productName: "Margherita",
      imageUrl: "/pizza/pizza-2.png",
      categoryId: 1,
      ingredients: {
        connect: getIngredientsSlice(4, 7, "Margherita"),
      },
    },
  });

  const pizza3 = await prisma.product.create({
    data: {
      productName: "Hawaiian",
      imageUrl: "/pizza/pizza-3.png",
      categoryId: 1,
      ingredients: {
        connect: getIngredientsSlice(1, 5, "Hawaiian"),
      },
    },
  });

  const pizza4 = await prisma.product.create({
    data: {
      productName: "BBQ Chicken",
      imageUrl: "/pizza/pizza-4.avif",
      categoryId: 1,
      ingredients: {
        connect: getIngredientsSlice(2, 6, "BBQ Chicken"),
      },
    },
  });

  const pizza5 = await prisma.product.create({
    data: {
      productName: "Four Cheese",
      imageUrl: "/pizza/pizza-5.avif",
      categoryId: 1,
      ingredients: {
        connect: getIngredientsSlice(0, 4, "Four Cheese"),
      },
    },
  });

  const pizza6 = await prisma.product.create({
    data: {
      productName: "Meat Lovers",
      imageUrl: "/pizza/pizza-6.avif",
      categoryId: 1,
      ingredients: {
        connect: getIngredientsSlice(3, 7, "Meat Lovers"),
      },
    },
  });

  const nonPizzaProducts = await prisma.product.findMany({
    where: {
      categoryId: {
        not: 1,
      },
    },
    select: {
      id: true,
      productName: true,
    },
  });

  const nonPizzaProductVariants = nonPizzaProducts.map((product) =>
    generateProductItem({
      productId: product.id,
      price: otherProductsPrices[product.productName] ?? randomNumber(6, 12),
    }),
  );

  const generateAllPizzaVariants = ({
    productId,
    pizzaName,
  }: {
    productId: number;
    pizzaName: string;
  }) => {
    const variantsConfig = pizzaVariantsByName[pizzaName];

    return ([1, 2] as const).flatMap((pizzaType) => {
      const availableSizes =
        variantsConfig?.[pizzaType] ?? ([20, 30, 40] as const);

      return availableSizes.map((size) =>
        generateProductItem({
          productId,
          pizzaType,
          size,
          price: getPizzaVariantPrice({ pizzaName, pizzaType, size }),
        }),
      );
    });
  };

  await prisma.productVariant.createMany({
    data: [
      ...generateAllPizzaVariants({
        productId: pizza1.id,
        pizzaName: pizza1.productName,
      }),
      ...generateAllPizzaVariants({
        productId: pizza2.id,
        pizzaName: pizza2.productName,
      }),
      ...generateAllPizzaVariants({
        productId: pizza3.id,
        pizzaName: pizza3.productName,
      }),
      ...generateAllPizzaVariants({
        productId: pizza4.id,
        pizzaName: pizza4.productName,
      }),
      ...generateAllPizzaVariants({
        productId: pizza5.id,
        pizzaName: pizza5.productName,
      }),
      ...generateAllPizzaVariants({
        productId: pizza6.id,
        pizzaName: pizza6.productName,
      }),

      // Другие продукты
      ...nonPizzaProductVariants,
    ],
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        totalAmount: 0,
        token: "123456",
      },

      {
        userId: 2,
        totalAmount: 0,
        token: "654321",
      },
    ],
  });

  await prisma.cartItem.create({
    data: {
      cartId: 1,
      productVariantId: 1,
      quantity: 2,
      ingredients: {
        connect: [{ id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }],
      },
    },
  });
}

// очищает данные перед генерацией
async function down() {
  // удаляет все данные из таблицы User и сбрасывает счетчик идентификаторов до начального значения, а также удаляет все связанные данные в других таблицах, которые ссылаются на таблицу User через внешние ключи.
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductVariant" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
}

async function main() {
  await down();
  await up();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
