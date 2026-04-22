import { cn } from "@/shared/lib/utils";

import { Container, Categories, SortPopup } from "@/components/shared";
import { categories } from "@/prisma/constants";
import { Category } from "@prisma/client";

interface Props {
  className?: string;
  categories?: Category[];
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 bg-white py-5 shadow-lg shadow-black/5",
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <Categories categories={categories} />
        <SortPopup />
      </Container>
    </div>
  );
};
