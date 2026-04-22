import type { Ingredient, ProductVariant } from "@prisma/client";

interface CalcTotalPizzaPriceParams {
  items: ProductVariant[];
  ingredients: Ingredient[];
  selectedIngredients: Set<number>;
  size: number;
  type: number;
}

export const calcTotalPizzaPrice = ({
  items,
  ingredients,
  selectedIngredients,
  size,
  type,
}: CalcTotalPizzaPriceParams): number => {
  const pizzaPrice =
    items.find((item) => item.pizzaType === type && item.size === size)
      ?.price ?? 0;

  const ingredientsPrice = ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((total, ingredient) => total + ingredient.price, 0);

  return pizzaPrice + ingredientsPrice;
};
