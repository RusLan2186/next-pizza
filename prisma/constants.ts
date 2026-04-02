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
    ingridientName: "Cheese Stuffed Crust",
    price: 4,
    imageUrl: "..public//ingridients/crust.png",
  },
  {
    ingridientName: "Creamy Mozzarella",
    price: 3,
    imageUrl: "..public//ingridients/mozzarella.png",
  },
  {
    ingridientName: "Cheddar & Parmesan",
    price: 2,
    imageUrl: "..public//ingridients/cheddar.png",
  },
  {
    ingridientName: "Spicy Jalapeño Peppers",
    price: 2,
    imageUrl: "..public//ingridients/peppers.png",
  },
  {
    ingridientName: "Tender Chicken",
    price: 4,
    imageUrl: "..public//ingridients/chicken.png",
  },
  {
    ingridientName: "Mushrooms",
    price: 3,
    imageUrl: "..public//ingridients/mushrooms.png",
  },
  {
    ingridientName: "Ham",
    price: 2,
    imageUrl: "..public//ingridients/ham.png",
  },
].map((obj, index) => ({ id: index + 1, ...obj }));

export const products = [
  {
    productName: "Caffè Latte",
    imageUrl: "../public/other-products/latte.webp",
    categoryId: 2,
  },
  {
    productName: "Ham & Cheese Sandwich",
    imageUrl: "../public/other-products/cheese-sandwich.webp",
    categoryId: 3,
  },

  {
    productName: "Oven-Baked Potatoes with Sauce 🌱",
    imageUrl: "../public/other-products/potato.webp",
    categoryId: 3,
  },
  {
    productName: "Dodster",
    imageUrl: "../public/other-products/dobster.webp",
    categoryId: 3,
  },

  {
    productName: "Banana Milkshake",

    imageUrl: "../public/other-products/banana__coctail.webp",
    categoryId: 4,
  },
  {
    productName: "Caramel Apple Milkshake",
    imageUrl: "../public/other-products/caramel__coctail.webp",
    categoryId: 4,
  },

  {
    productName: "Caramel Cappuccino",
    imageUrl: "../public/other-products/caramel__cappuchino.webp",
    categoryId: 5,
  },
  {
    productName: "Coconut Latte",
    imageUrl: "../public/other-products/late.webp",
    categoryId: 5,
  },
  {
    productName: "Americano",
    imageUrl: "../public/other-products/americano.webp",
    categoryId: 5,
  },
];
