"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "@/@types/prisma";
import { ChoosePizzaForm } from "../choose-pizza-form";

interface Props {
  className?: string;
  product: ProductWithRelations;
}

export const ChooseProductModal: React.FC<Props> = ({ className, product }) => {
  const router = useRouter();

  const izPizzaForm = Boolean(product.variants[0].pizzaType);
  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          "p-0 w-[1060px] sm:max-w-[1060px] min-h-[500px] bg-white",
          className,
        )}
      >
        {izPizzaForm ? (
          <ChoosePizzaForm
            imageUrl={product.imageUrl}
            name={product.productName}
            ingredients={product.ingredients}
            onClickAddCart={() => {}}
            items={product.variants}
          />
        ) : (
          <ChooseProductForm
            imageUrl={product.imageUrl}
            name={product.productName}
            onClickAdd={() => {}}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
