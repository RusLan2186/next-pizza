"use client";

import React, { useEffect } from "react";
import { Title } from "./title";
import { cn } from "@/shared/lib/utils";
import { useIntersection } from "react-use";
import { ProductCard } from "./product-card";
import { useCategoryStore } from "@/shared/store/category";
import { ProductWithRelations } from "@/@types/prisma";


interface Props {
  title: string;
  products: ProductWithRelations[];
  categoryId: number;
  className?: string;
  listClassName?: string;
}

export const ProductsListGroup: React.FC<Props> = ({
  title,
  products,
  className,
  listClassName,
  categoryId,
}) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const intersectionRef = React.useRef<HTMLDivElement | null>(null);
  const intersection = useIntersection(
    intersectionRef as React.RefObject<HTMLElement>,
    {
      threshold: 0.4,
    },
  );

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [intersection?.isIntersecting, title, categoryId]);

  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="mb-5 font-extrabold" />

      <div className={cn("grid grid-cols-3 gap-[50px]")}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.productName}
            price={Math.min(...(product.variants?.map((v) => v.price) ?? [0]))}
            imageUrl={product.imageUrl}
            ingredients={product.ingredients}
          />
        ))}
      </div>
    </div>
  );
};
