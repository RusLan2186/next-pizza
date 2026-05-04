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

  const selectedSort: SortValue = isSortValue(searchParams.get("sortBy"))
    ? searchParams.get("sortBy")
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
        className={cn(
          "inline-flex h-[52px] max-w-[180px] items-center gap-1 rounded-2xl border-0 bg-gray-50 px-3 transition-colors hover:bg-gray-100 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-transparent sm:max-w-none sm:gap-2 sm:px-5",
          className,
        )}
      >
        <ArrowDownUp size={16} />
        <b className="hidden sm:inline">Sort by</b>
        <b className="ml-2 max-w-[88px] truncate text-primary sm:ml-3 sm:max-w-none">
          <SelectValue />
        </b>
      </SelectTrigger>
      <SelectContent>
        {sortItems.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
