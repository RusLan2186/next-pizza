"use client";

import { CheckboxFiltersGroup, RangeSlider, Title } from "@/components/shared";
import { Input } from "../ui";
import { useFilters } from "@/shared/hooks/use-filters";
import {
  useFiltersQueryParams,
  useSyncFiltersQueryParams,
} from "@/shared/hooks/use-filters-query";
import { useIngredients } from "@/shared/hooks/use-ingredients";

interface Props {
  className?: string;
}

const MIN_PRICE = 0;
const MAX_PRICE = 30;

const SIZES_ITEMS = [
  { text: "small", value: "20" },
  { text: "medium", value: "30" },
  { text: "large", value: "40" },
];

const PIZZA_TYPES_ITEMS = [
  { text: "thin", value: "thin" },
  { text: "traditional", value: "traditional" },
];

const capPriceByMax = (value: string) => {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return undefined;
  }

  return Math.min(parsedValue, MAX_PRICE);
};

export const Filters: React.FC<Props> = ({ className }) => {
  const initialFilters = useFiltersQueryParams();
  const {
    sizes,
    toogleSizes,
    pizzaTypes,
    tooglePizzaTypes,
    price,
    setPrice,
    selectedIngredients,
    onAddId,
  } = useFilters(initialFilters);

  useSyncFiltersQueryParams({
    price,
    sizes,
    pizzaTypes,
    selectedIngredients,
  });

  const { ingredients, loading } = useIngredients();

  const ingredientsItems = ingredients.map((ingredient) => ({
    value: String(ingredient.id),
    text: ingredient.ingredientName,
  }));

  return (
    <div className={className}>
      <Title text="Filters" size="sm" className="mb-5 font-bold" />

      <div className="mb-2">
        <CheckboxFiltersGroup
          className="mt-5"
          title="Sizes"
          name="sizes"
          selectedIds={sizes}
          onClickCheckbox={toogleSizes}
          items={SIZES_ITEMS}
        />
      </div>

      <div className="flex flex-col gap-4">
        <CheckboxFiltersGroup
          className="mt-5"
          title="Pizza Types"
          name="types"
          selectedIds={pizzaTypes}
          onClickCheckbox={tooglePizzaTypes}
          items={PIZZA_TYPES_ITEMS}
        />
      </div>

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3 capitalize">price range</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={String(price.priceFrom)}
            onChange={(e) =>
              setPrice({ ...price, priceFrom: capPriceByMax(e.target.value) })
            }
          />
          <Input
            type="number"
            placeholder="30$"
            min={10}
            max={MAX_PRICE}
            value={String(price.priceTo)}
            onChange={(e) =>
              setPrice({ ...price, priceTo: capPriceByMax(e.target.value) })
            }
          />
        </div>

        <RangeSlider
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={1}
          value={[price.priceFrom || MIN_PRICE, price.priceTo || MAX_PRICE]}
          onValueChange={([priceFrom, priceTo]) =>
            setPrice({ priceFrom, priceTo })
          }
        />
      </div>

      <CheckboxFiltersGroup
        title="Ingredients"
        className="mt-5"
        limit={5}
        items={ingredientsItems}
        defaultIngredients={ingredientsItems.slice(0, 5)}
        loading={loading}
        onClickCheckbox={onAddId}
        selectedIds={selectedIngredients}
      />
    </div>
  );
};
