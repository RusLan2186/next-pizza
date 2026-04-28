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
    <div className={cn("flex items-center  my-4")}>
      <span className="flex  text-lg text-neutral-500">{title}</span>
      <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -bottom-2 mx-2"></div>

      <span className="font-bold text-lg">{value} </span>
    </div>
  );
};
