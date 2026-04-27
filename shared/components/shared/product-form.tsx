'use client';

import { ProductWithRelations } from "@/@types/prisma";
import { useCartStore } from "@/shared/store";
import toast from "react-hot-toast";
import { ChoosePizzaForm } from "./choose-pizza-form";
import { ChooseProductForm } from "./choose-product-form";

interface Props {
  product: ProductWithRelations;
  onSubmit?:VoidFunction
}

export const ProductForm: React.FC<Props> = ({ product, onSubmit }) => {
  const { addCartItem, loading } = useCartStore((store) => store);
  const firstItem = product.variants[0];
  const isPizzaForm = Boolean(firstItem.pizzaType);

  const handleAddToCart = async (
    productItemId: number,
    ingredients?: number[],
  ) => {
    try {
      const itemId = productItemId ?? firstItem.id;
      await addCartItem({
        productItemId: itemId,
        ingredients,
      });

      toast.success(`${product.productName} added to cart`);
      onSubmit?.();
    } catch (error) {
      toast.error("Error adding to cart");
      console.error("Error adding product to cart", error);
    }
  };
  if (isPizzaForm) {
    return (
      <ChoosePizzaForm
        imageUrl={product.imageUrl}
        name={product.productName}
        ingredients={product.ingredients}
        onClickAddCart={handleAddToCart}
        items={product.variants}
        loading={loading}
      />
    );
  }

  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.productName}
      price={firstItem.price}
      onClickAdd={() => handleAddToCart(firstItem.id)}
      loading={loading}
    />
  );
};
