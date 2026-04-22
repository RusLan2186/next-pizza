import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { PriceProps, UseFiltersInitialValues } from "./use-filters";

interface QueryFilters extends PriceProps {
  sizes?: string;
  pizzaTypes?: string;
  ingredients?: string;
}

interface SyncValues {
  price: PriceProps;
  sizes: Set<string>;
  pizzaTypes: Set<string>;
  selectedIngredients: Set<string>;
}

const parseNumberOrUndefined = (value: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const useFiltersQueryParams = (): UseFiltersInitialValues => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const params = searchParams as unknown as Map<keyof QueryFilters, string>;

    return {
      sizes: params.has("sizes") ? params.get("sizes")?.split(",") : [],
      pizzaTypes: params.has("pizzaTypes")
        ? params.get("pizzaTypes")?.split(",")
        : [],
      ingredients: params.has("ingredients")
        ? params.get("ingredients")?.split(",")
        : [],
      price: {
        priceFrom: parseNumberOrUndefined(params.get("priceFrom") ?? null),
        priceTo: parseNumberOrUndefined(params.get("priceTo") ?? null),
      },
    };
  }, [searchParams]);
};

export const useSyncFiltersQueryParams = ({
  price,
  sizes,
  pizzaTypes,
  selectedIngredients,
}: SyncValues) => {
  const router = useRouter();

  useEffect(() => {
    const filters = {
      ...price,
      sizes: Array.from(sizes),
      pizzaTypes: Array.from(pizzaTypes),
      ingredients: Array.from(selectedIngredients),
    };

    const query = qs.stringify(filters, { arrayFormat: "comma" });
    router.push(`?${query}`, { scroll: false });
  }, [price, sizes, pizzaTypes, selectedIngredients, router]);
};
