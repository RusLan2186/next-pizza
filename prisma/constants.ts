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
    productName: "Caffè Latte",
    imageUrl: "/other-products/latte.webp",
    categoryId: 2,
  },
  {
    productName: "Ham & Cheese Sandwich",
    imageUrl: "/other-products/cheese-sandwich.webp",
    categoryId: 3,
  },

  {
    productName: "Oven-Baked Potatoes with Sauce 🌱",
    imageUrl: "/other-products/potato.webp",
    categoryId: 3,
  },
  {
    productName: "Dodster",
    imageUrl: "/other-products/dobster.webp",
    categoryId: 3,
  },

  {
    productName: "Banana Milkshake",

    imageUrl: "/other-products/banana__coctail.webp",
    categoryId: 4,
  },
  {
    productName: "Caramel Apple Milkshake",
    imageUrl: "/other-products/caramel__coctail.webp",
    categoryId: 4,
  },

  {
    productName: "Caramel Cappuccino",
    imageUrl: "/other-products/caramel__cappuchino.webp",
    categoryId: 5,
  },
  {
    productName: "Coconut Latte",
    imageUrl: "/other-products/late.webp",
    categoryId: 5,
  },
  {
    productName: "Americano",
    imageUrl: "/other-products/americano.webp",
    categoryId: 5,
  },
];
