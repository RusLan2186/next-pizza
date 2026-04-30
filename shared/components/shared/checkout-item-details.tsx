import { cn } from "@/shared/lib/utils";
import React from "react";

interface Props {
  title?: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
}

export const CheckoutItemDetails: React.FC<Props> = ({
  className,
  title,
  value,
}) => {
  return (
    <div className={cn("my-3 flex items-center md:my-4", className)}>
      <span className="flex text-base text-neutral-500 md:text-lg">
        {title}
      </span>
      <div className="relative -bottom-2 mx-2 flex-1 border-b border-dashed border-b-neutral-200"></div>

      <span className="text-base font-bold md:text-lg">{value} </span>
    </div>
  );
};
