"use client";

import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/category";

interface Props {
  className?: string;
}

/*************  ✨ Windsurf Command 🌟  *************/
const cats = [
  { id: 1, name: "Pizza" },
  { id: 2, name: "Pasta" },
  { id: 3, name: "Salads" },
  { id: 4, name: "Desserts" },
  { id: 5, name: "Appertizers" },
  { id: 6, name: "Coctails" },
  { id: 7, name: "Combos" },
  { id: 8, name: "Drinks" },
];

export const Categories: React.FC<Props> = ({ className }) => {
  const categoryAcriveId = useCategoryStore((state) => state.activeId);
  return (
    <div
      className={cn("inline-flex gap-4 bg-gray-50 p-1 rounded-2xl", className)}
    >
      {cats.map((cat) => (
        <a href={`/#${cat.name}`}
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-2",
            cat.id === categoryAcriveId &&
              "bg-white shadow-md shadow-grey-200 text-primary px-3",
          )}
          key={cat.id}
        >
          <button>{cat.name}</button>
        </a>
      ))}
    </div>
  );
};
