"use client";

import { cn } from "@/shared/lib/utils";
import { ArrowDownUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

type SortValue = "popularity" | "price_asc" | "price_desc";

const sortItems: Array<{ value: SortValue; label: string }> = [
  { value: "popularity", label: "Popular" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
];

const isSortValue = (value: string | null): value is SortValue =>
  value === "popularity" || value === "price_asc" || value === "price_desc";

interface Props {
  className?: string;
}

export const SortPopup: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortByParam = searchParams.get("sortBy");

  const selectedSort: SortValue = isSortValue(sortByParam)
    ? sortByParam
    : "popularity";

  const onChangeSort = (value: string) => {
    if (!isSortValue(value)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (value === "popularity") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", value);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <Select value={selectedSort} onValueChange={onChangeSort}>
      <SelectTrigger
        variant="ghost"
        className={cn(
          "inline-flex w-[170px] max-w-none items-center gap-1 rounded-2xl bg-gray-50 px-3 hover:bg-gray-100 sm:w-[220px] sm:gap-2 sm:px-5",
          className,
        )}
      >
        <ArrowDownUp size={16} />
        <b className="hidden sm:inline">Sort by</b>
        <b className="ml-2 min-w-[64px] truncate text-left text-primary sm:ml-3 sm:min-w-[78px]">
          <SelectValue />
        </b>
      </SelectTrigger>
      <SelectContent className="border border-gray-200 !ring-0 shadow-md">
        {sortItems.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
