"use client";

import React, { useState } from "react";
import { FilterChecboxProps, FilterCheckbox } from "./filter-checkbox";
import { Input } from "../ui";

type Item = FilterChecboxProps;

interface Props {
  title: string;
  ingredients: Item[];
  defaultIngredients?: Item[];
  limit?: number;
  searchInputPlaceholder?: string;
  onChange?: (values: string[]) => void;
  defaultValues?: string[];
  className?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  ingredients,
  defaultIngredients = [],
  limit = 5,
  searchInputPlaceholder = "Search...",
  onChange,
  className,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const ingredientsList = showAll
    ? ingredients.filter((ingredient) =>
        ingredient.text.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : defaultIngredients.slice(0, limit);
  return (
    <div className={className}>
      <p className="font-bold mb-3">{title}</p>

      {showAll && (
        <div className="mb-5">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchInputPlaceholder}
            className="bg-gray-50 border-none"
          />
        </div>
      )}

      {ingredientsList.length > 0 ? (
        <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
          {ingredientsList.map((ingredient) => (
            <FilterCheckbox
              key={ingredient.value}
              onCheckedChange={(ids) => console.log(ids)}
              checked={false}
              value={ingredient.value}
              text={ingredient.text}
              endAdornment={ingredient.endAdornment}
            />
          ))}
        </div>
      ) : (
        <h1 className="text-red-500 capitalize">not foundet!!</h1>
      )}

      {ingredients.length > limit && (
        <div className={showAll ? "border-t border-t-neutral-100 mt-4" : ""}>
          <button
            className="text-primary mt-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : "+ Show all"}
          </button>
        </div>
      )}
    </div>
  );
};
