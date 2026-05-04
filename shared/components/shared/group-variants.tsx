"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

type Variant = {
  name: string;
  value: string;
  disabled?: boolean;
};

interface Props {
  items: readonly Variant[];
  onClick?: (value: Variant["value"]) => void;
  className?: string;
  value?: Variant["value"];
}

export const GroupVariants: React.FC<Props> = ({
  className,
  items,
  onClick,
  value,
}) => {
  return (
    <div
      className={cn(
        className,
        "flex justify-between rounded-t-3xl bg-[#F3F3F7] select-none p-1",
      )}
    >
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onClick?.(item.value)}
          className={cn(
            "flex h-[30px] flex-1 cursor-pointer items-center justify-center rounded-3xl px-5 text-sm transition-all duration-300 hover:bg-white/70 hover:text-primary",
            {
              "bg-white shadow": item.value === value,
              "text-gray-500 opacity-50 pointer-events-none": item.disabled,
            },
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
