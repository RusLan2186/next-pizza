import { cn } from "@/shared/lib/utils";

import { Container, Categories, SortPopup } from "@/components/shared";
import { FiltersDrawer } from "./filters-drawer";
import { Category } from "@prisma/client";

interface Props {
  className?: string;
  categories?: Category[];
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  return (
    <div
      data-top-bar
      className={cn(
        "sticky top-0 z-10 bg-white py-5 shadow-lg shadow-black/5",
        className,
      )}
    >
      <Container className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Categories
          categories={categories}
          className="w-full overflow-x-auto md:w-auto"
        />
        <div className="flex items-center justify-between gap-3 md:justify-end">
          <FiltersDrawer />
          <SortPopup className="h-10 rounded-xl px-3 md:h-[52px] md:rounded-2xl md:px-5" />
        </div>
      </Container>
    </div>
  );
};
