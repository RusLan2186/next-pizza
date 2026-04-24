"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "@/@types/prisma";
import { ChoosePizzaForm } from "../choose-pizza-form";
import { useCartStore } from "@/shared/store";
import toast from "react-hot-toast";

interface Props {
  className?: string;
  product: ProductWithRelations;
}

export const ChooseProductModal: React.FC<Props> = ({ className, product }) => {
  const router = useRouter();
  const firstItem = product.variants[0];
  const izPizzaForm = Boolean(firstItem.pizzaType);
  const addCartItem = useCartStore((store) => store.addCartItem);

  const onAddProduct = async () => {
    try {
      await addCartItem({
        productItemId: firstItem.id,
      });
      router.back();
      toast.success("Product added to cart");
    } catch (error) {
      toast.error("Error adding product to cart");
      console.error("Error adding product to cart", error);
    }
  };

  const onAddPizza = async (productItemId: number, ingredients: number[]) => {
    try {
      await addCartItem({
        productItemId,
        ingredients,
      });
      router.back();
      toast.success("Pizza added to cart");
    } catch (error) {
      toast.error("Error adding pizza to cart");
      console.error("Error adding pizza to cart", error);
    }
  };

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
            onClickAddCart={onAddPizza}
            items={product.variants}
          />
        ) : (
          <ChooseProductForm
            imageUrl={product.imageUrl}
            name={product.productName}
            price={firstItem.price}
            onClickAdd={onAddProduct}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
