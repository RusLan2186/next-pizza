"use client";

import { cn } from "@/shared/lib/utils";
import { useCategoryStore } from "@/shared/store/category";
import { Category } from "@prisma/client";
import React from "react";

interface Props {
  className?: string;
  categories?: Category[];
}

/*************  ✨ Windsurf Command 🌟  *************/

export const Categories: React.FC<Props> = ({ categories, className }) => {
  const categoryAcriveId = useCategoryStore((state) => state.activeId);

  const categoryRefs = React.useRef<Record<number, HTMLAnchorElement | null>>(
    {},
  );

  React.useEffect(() => {
    if (!categoryAcriveId) {
      return;
    }

    const activeElement = categoryRefs.current[categoryAcriveId];
    if (!activeElement) {
      return;
    }

    activeElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [categoryAcriveId]);

  return (
    <div
      className={cn(
        "categories-scroll flex gap-2 bg-gray-50 px-1 pt-1 pb-2 rounded-2xl overflow-x-auto",
        className,
      )}
    >
      {categories?.map((cat) => (
        <a
          ref={(el) => {
            categoryRefs.current[cat.id] = el;
          }}
          href={`/#${cat.categoryName}`}
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-3 whitespace-nowrap",
            cat.id === categoryAcriveId &&
              "bg-white shadow-md shadow-grey-200 text-primary",
          )}
          key={cat.id}
        >
          <button>{cat.categoryName}</button>
        </a>
      ))}
    </div>
  );
};
