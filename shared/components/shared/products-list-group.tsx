"use client";

import React from "react";
import { Title } from "./title";
import { cn } from "@/shared/lib/utils";
import { ProductCard } from "./product-card";
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
  return (
    <section
      className={className}
      id={`category-${categoryId}`}
      data-category-id={categoryId}
    >
      <Title text={title} size="lg" className="mb-5 font-extrabold" />

      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[50px]",
          listClassName,
        )}
      >
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
    </section>
  );
};
