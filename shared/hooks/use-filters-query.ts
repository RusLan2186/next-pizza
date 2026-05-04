import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentQuery = searchParams.toString();
    const params = new URLSearchParams(currentQuery);

    const setOrDelete = (key: string, value?: string) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    };

    setOrDelete("priceFrom", price.priceFrom?.toString());
    setOrDelete("priceTo", price.priceTo?.toString());
    setOrDelete("sizes", Array.from(sizes).join(","));
    setOrDelete("pizzaTypes", Array.from(pizzaTypes).join(","));
    setOrDelete("ingredients", Array.from(selectedIngredients).join(","));

    const nextQuery = params.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [
    price,
    sizes,
    pizzaTypes,
    selectedIngredients,
    router,
    pathname,
    searchParams,
  ]);
};
