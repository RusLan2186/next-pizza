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
            "flex items-center justify-center cursor-pointer h-[30px] px-5 flex-1 rounded-3xl transition-all duration-400 text-sm",
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
