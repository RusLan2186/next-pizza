"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Filters } from "./filters";
import { Suspense } from "react";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
}

export const FiltersDrawer: React.FC<Props> = ({ className }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex h-10 items-center gap-2 md:hidden", className)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <VisuallyHidden>
          <SheetTitle>Filters</SheetTitle>
        </VisuallyHidden>
        <div className="mt-4 px-4">
          <Suspense>
            <Filters />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
};
