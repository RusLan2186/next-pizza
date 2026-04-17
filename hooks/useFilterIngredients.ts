import { Api } from "@/services/api-client";
import { Ingredient } from "@prisma/client";

import { useEffect, useState } from "react";
import { useSet } from "react-use";

type IngredientItem = Pick<Ingredient, "id" | "ingredientName">;

interface ReturnProps {
  ingredients: IngredientItem[];
  loading: boolean;
  selectedIngredients: Set<string>;
  onAddId: (id: string) => void;
}

export const useFilterIngredients = (values: string[] = []): ReturnProps => {
  const [ingredients, setIngredients] = useState<ReturnProps["ingredients"]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [selectedIds, { toggle }] = useSet(new Set<string>(values));
  useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const data = await Api.ingredients.getAll();
        setIngredients(
          data.map((ingredient) => ({
            id: ingredient.id,
            ingredientName: ingredient.ingredientName,
          })),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchIngredients();
  }, []);

  return {
    ingredients,
    loading,
    selectedIngredients: selectedIds,
    onAddId: toggle,
  };
};
