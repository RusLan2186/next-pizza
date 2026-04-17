"use client";

import { CheckboxFiltersGroup, RangeSlider, Title } from "@/components/shared";
import { Input } from "../ui";
import { useFilterIngredients } from "@/hooks/useFilterIngredients";
import { useEffect, useState } from "react";
import { useSet } from "react-use";
import qs from "qs";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface Props {
  className?: string;
}

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

interface QueryFilters extends PriceProps {
  sizes: string;
  pizzaTypes: string;
  ingredients: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams() as unknown as Map<
    keyof QueryFilters,
    string
  >;
  const { ingredients, loading, onAddId, selectedIngredients } =
    useFilterIngredients( searchParams.get("ingredients")?.split(","));
  const [sizes, { toggle: toogleSizes }] = useSet(new Set<string>(searchParams.has("sizes")? searchParams.get("sizes")?.split(",") : []));
  const [pizzaTypes, { toggle: tooglePizzaTypes }] = useSet(
    new Set<string>((searchParams.has("pizzaTypes")? searchParams.get("pizzaTypes")?.split(",") : [])),
  );
  const [price, setPrice] = useState<PriceProps>({
    priceFrom: Number(searchParams.get("priceFrom")) || undefined,
    priceTo: Number(searchParams.get("priceTo")) || undefined,
  });

  const ingredientsItems = ingredients.map((ingredient) => ({
    value: String(ingredient.id),
    text: ingredient.ingredientName,
  }));



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
          items={[
            { text: "small", value: "20" },
            { text: "medium", value: "30" },
            { text: "large", value: "40" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-4">
        <CheckboxFiltersGroup
          className="mt-5"
          title="Pizza Types"
          name="types"
          selectedIds={pizzaTypes}
          onClickCheckbox={tooglePizzaTypes}
          items={[
            { text: "thin", value: "thin" },
            { text: "traditional", value: "traditional" },
          ]}
        />
      </div>

      {/* <div className="flex flex-col gap-4">
        <FilterCheckbox name="new" text="New" value="1" />
        <FilterCheckbox name="popular" text="popular" value="2" />
      </div> */}

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3 capitalize">price range</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={30}
            value={String(price.priceFrom)}
            onChange={(e) =>
              setPrice({ ...price, priceFrom: Number(e.target.value) })
            }
          />
          <Input
            type="number"
            placeholder="30$"
            min={10}
            max={30}
            value={String(price.priceTo)}
            onChange={(e) =>
              setPrice({ ...price, priceTo: Number(e.target.value) })
            }
          />
        </div>

        <RangeSlider
          min={0}
          max={30}
          step={1}
          value={[price.priceFrom || 0, price.priceTo || 30]}
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
