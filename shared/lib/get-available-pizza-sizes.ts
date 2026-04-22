import { pizzaSizes, PizzaType, pizzaTypes } from "@/shared/constants/pizza";
import type { ProductVariant } from "@prisma/client";

type PizzaVariantOption = {
  name: string;
  value: string;
  disabled?: boolean;
};

export const getAvailablePizzaSizes = (
  type: PizzaType,
  items: ProductVariant[],
): PizzaVariantOption[] =>
  pizzaSizes.map((size) => ({
    ...size,
    disabled: !items.some(
      (item) => item.pizzaType === type && item.size === Number(size.value),
    ),
  }));

export const getAvailablePizzaTypes = (
  items: ProductVariant[],
): PizzaVariantOption[] =>
  pizzaTypes.map((pizzaType) => ({
    ...pizzaType,
    disabled: !items.some((item) => item.pizzaType === Number(pizzaType.value)),
  }));

export const getFirstAvailablePizzaSize = (
  type: PizzaType,
  items: ProductVariant[],
): number | null => {
  const firstAvailable = getAvailablePizzaSizes(type, items).find(
    (size) => !size.disabled,
  );

  return firstAvailable ? Number(firstAvailable.value) : null;
};
