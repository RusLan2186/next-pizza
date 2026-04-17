export const categories = [
  {
    categoryName: "Pizza",
  },

  {
    categoryName: "Breakfast",
  },

  {
    categoryName: "Appertizers",
  },

  {
    categoryName: "Coctails",
  },

  {
    categoryName: "Drinks",
  },
];

export const ingredients = [
  {
    ingredientName: "Cheese Stuffed Crust",
    price: 4,
    imageUrl: "/ingredients/crust.png",
  },
  {
    ingredientName: "Creamy Mozzarella",
    price: 3,
    imageUrl: "/ingredients/mozzarella.png",
  },
  {
    ingredientName: "Cheddar & Parmesan",
    price: 2,
    imageUrl: "/ingredients/cheddar.png",
  },
  {
    ingredientName: "Spicy Jalapeño Peppers",
    price: 2,
    imageUrl: "/ingredients/peppers.png",
  },
  {
    ingredientName: "Tender Chicken",
    price: 4,
    imageUrl: "/ingredients/chicken.png",
  },
  {
    ingredientName: "Mushrooms",
    price: 3,
    imageUrl: "/ingredients/mushrooms.png",
  },
  {
    ingredientName: "Ham",
    price: 2,
    imageUrl: "/ingredients/ham.png",
  },
].map((obj, index) => ({ id: index + 1, ...obj }));

export const products = [

  {
    productName: "Ham & Cheese Sandwich",
    imageUrl: "/other-products/breakfast/cheese-sandwich.webp",
    categoryId: 2,
  },
  {
    productName: "Classic Omelet",
    imageUrl: "/other-products/breakfast/omlet.avif",
    categoryId: 2,
  },
  {
    productName: "Cheese Omelet",
    imageUrl: "/other-products/breakfast/cheese-omlet.avif",
    categoryId: 2,
  },

  {
    productName: "Oven-Baked Potatoes with Sauce 🌱",
    imageUrl: "/other-products/appetizers/potato.webp",
    categoryId: 3,
  },
  {
    productName: "Dodster",
    imageUrl: "/other-products/appetizers/dobster.webp",
    categoryId: 3,
  },
  {
    productName: "Chicken Roll",
    imageUrl: "/other-products/appetizers/chicken-roll.avif",
    categoryId: 3,
  },
  {
    productName: "Spicy Dodster",
    imageUrl: "/other-products/appetizers/dodster-chill.avif",
    categoryId: 3,
  },
  {
    productName: "Cupcakes",
    imageUrl: "/other-products/appetizers/cupcackes.avif",
    categoryId: 3,
  },
  {
    productName: "Rustic Potatoes",
    imageUrl: "/other-products/appetizers/potato.avif",
    categoryId: 3,
  },

  {
    productName: "Banana Milkshake",

    imageUrl: "/other-products/cocktails/banana__coctail.webp",
    categoryId: 4,
  },
  {
    productName: "Caramel Apple Milkshake",
    imageUrl: "/other-products/cocktails/caramel__coctail.webp",
    categoryId: 4,
  },
  {
    productName: "Berry Mojito",
    imageUrl: "/other-products/cocktails/coctail-2.avif",
    categoryId: 4,
  },
  {
    productName: "Mango Fizz",
    imageUrl: "/other-products/cocktails/coctail-3.avif",
    categoryId: 4,
  },

  {
    productName: "Caramel Cappuccino",
    imageUrl: "/other-products/drinks/caramel__cappuchino.webp",
    categoryId: 5,
  },
  {
    productName: "Coconut Latte",
    imageUrl: "/other-products/drinks/late.webp",
    categoryId: 5,
  },
  {
    productName: "Americano",
    imageUrl: "/other-products/drinks/americano.webp",
    categoryId: 5,
  },
];
