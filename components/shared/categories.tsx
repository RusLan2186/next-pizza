"use client";

import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/category";
import { Category } from "@prisma/client";


interface Props {
  className?: string;
  categories?: Category[];

}

/*************  ✨ Windsurf Command 🌟  *************/


export const Categories: React.FC<Props> = ({ categories, className }) => {
  const categoryAcriveId = useCategoryStore((state) => state.activeId);
  return (
    <div
      className={cn("inline-flex gap-4 bg-gray-50 p-1 rounded-2xl", className)}
    >
      {categories?.map((cat) => (
        <a
          href={`/#${cat.categoryName}`}
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-2",
            cat.id === categoryAcriveId &&
              "bg-white shadow-md shadow-grey-200 text-primary px-3",
          )}
          key={cat.id}
        >
          <button>{cat.categoryName}</button>
        </a>
      ))}
    </div>
  );
};
