import React from "react";
import { Title } from "./title";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
  contentClassName?: string;
  title?: string;
  endAdornment?: React.ReactNode;
}

export const WhiteBlock: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  endAdornment,
  className,
  contentClassName,
  children,
}) => {
  return (
    <div className={cn("rounded-2xl bg-white md:rounded-3xl", className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 md:p-5 md:px-7">
          <Title text={title} size="sm" className="font-bold" />
          {endAdornment}
        </div>
      )}

      <div className={cn("px-3 py-3 md:px-5 md:py-4", contentClassName)}>
        {children}
      </div>
    </div>
  );
};
