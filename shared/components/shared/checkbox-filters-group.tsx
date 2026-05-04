"use client";

import React, { useState } from "react";
import { FilterChecboxProps, FilterCheckbox } from "./filter-checkbox";
import { Input, Skeleton } from "../ui";

type Item = FilterChecboxProps;

interface Props {
  title: string;
  items: Item[];
  defaultIngredients?: Item[];
  limit?: number;
  loading?: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (id: string) => void;
  defaultValues?: string[];
  className?: string;
  selectedIds?: Set<string>;
  name?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  defaultIngredients = [],
  limit = 5,
  searchInputPlaceholder = "Search...",
  loading,
  onClickCheckbox,
  selectedIds,
  name,
  className,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  if (loading) {
    return (
      <div>
        <p className="font-bold mb-3"></p>

        {[...Array(limit).fill(0)].map((_, index) => (
          <Skeleton key={index} className="h-4 mb-4 rounded-[8px]"></Skeleton>
        ))}

        <Skeleton className="h-4 w-28 mb-4 rounded-[8px]"></Skeleton>
      </div>
    );
  }

  const sortedItems = [...items].sort((a, b) => {
    const aSelected = selectedIds?.has(a.value) ? 1 : 0;
    const bSelected = selectedIds?.has(b.value) ? 1 : 0;
    return bSelected - aSelected;
  });

  const filteredAndSortedItems = sortedItems.filter((ingredient) =>
    ingredient.text.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const ingredientsList = showAll
    ? filteredAndSortedItems
    : (defaultIngredients && sortedItems).slice(0, limit);

  const shouldShowToggle =
    items.length > limit && (!showAll || filteredAndSortedItems.length > 0);

  return (
    <div className={className}>
      <p className="font-bold mb-3">{title}</p>

      {showAll && (
        <div className="mb-5">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchInputPlaceholder}
            className="bg-gray-50"
          />
        </div>
      )}

      {ingredientsList.length > 0 ? (
        <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
          {ingredientsList.map((ingredient) => (
            <FilterCheckbox
              key={ingredient.value}
              checked={selectedIds?.has(ingredient.value)}
              value={ingredient.value}
              text={ingredient.text}
              endAdornment={ingredient.endAdornment}
              onCheckedChange={() => onClickCheckbox?.(ingredient.value)}
              name={name}
            />
          ))}
        </div>
      ) : (
        <h1 className="text-red-500 capitalize">not foundet!!</h1>
      )}

      {shouldShowToggle && (
        <div className={showAll ? "border-t border-t-neutral-100 mt-4" : ""}>
          <button
            className="mt-4 text-primary transition-colors hover:text-primary/80 hover:underline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : "+ Show all"}
          </button>
        </div>
      )}
    </div>
  );
};
