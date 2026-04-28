import React from "react";
import { cn } from "@/shared/lib/utils";
import { CountIconButton } from "./count-icon-button";
import { Loader2 } from "lucide-react";

export interface CountButtonProps {
  value?: number;
  size?: "sm" | "lg";
  loading?: boolean;
  onClick?: (type: "increment" | "decrement") => void;
  className?: string;
}

export const CountButton: React.FC<CountButtonProps> = ({
  className,
  onClick,
  value = 1,
  size = "sm",
  loading = false,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-3",
        size === "sm" ? "w-[92px]" : "w-[118px]",
        className,
      )}
    >
      <CountIconButton
        onClick={() => onClick?.("decrement")}
        disabled={loading || value === 1}
        size={size}
        type="minus"
      />

      <span className="inline-flex w-4 items-center justify-center">
        {loading ? (
          <Loader2 className="text-gray-400 animate-spin" size={16} />
        ) : (
          <b className={size === "sm" ? "text-sm" : "text-md"}>{value}</b>
        )}
      </span>

      <CountIconButton
        onClick={() => onClick?.("increment")}
        disabled={loading}
        size={size}
        type="plus"
      />
    </div>
  );
};
