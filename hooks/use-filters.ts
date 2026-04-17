import { useState } from "react";
import { useSet } from "react-use";

export interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export interface UseFiltersInitialValues {
  sizes?: string[];
  pizzaTypes?: string[];
  ingredients?: string[];
  price?: PriceProps;
}

interface ReturnProps {
  sizes: Set<string>;
  toogleSizes: (key: string) => void;
  pizzaTypes: Set<string>;
  tooglePizzaTypes: (key: string) => void;
  price: PriceProps;
  setPrice: (price: PriceProps) => void;
  selectedIngredients: Set<string>;
  onAddId: (id: string) => void;
}

export const useFilters = (
  initialValues: UseFiltersInitialValues = {},
): ReturnProps => {
  const [sizes, { toggle: toogleSizes }] = useSet(
    new Set<string>(initialValues.sizes ?? []),
  );
  const [pizzaTypes, { toggle: tooglePizzaTypes }] = useSet(
    new Set<string>(initialValues.pizzaTypes ?? []),
  );
  const [price, setPrice] = useState<PriceProps>({
    priceFrom: initialValues.price?.priceFrom,
    priceTo: initialValues.price?.priceTo,
  });
  const [selectedIngredients, { toggle: onAddId }] = useSet(
    new Set<string>(initialValues.ingredients ?? []),
  );

  return {
    sizes,
    toogleSizes,
    pizzaTypes,
    tooglePizzaTypes,
    price,
    setPrice,
    selectedIngredients,
    onAddId,
  };
};
