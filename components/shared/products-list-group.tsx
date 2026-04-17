"use client";

import React, {  useEffect } from "react";
import { Title } from "./title";
import { cn } from "@/lib/utils";
import { useIntersection } from "react-use";
import { ProductCard } from "./product-card";
import { useCategoryStore } from "@/store/category";
import { Product } from "@prisma/client";

interface Props {
  title: string;
  products: any;
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
            price={product.variants?.[0]?.price ?? 0}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};
