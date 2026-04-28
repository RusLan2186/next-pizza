"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type CountAction = "increment" | "decrement";

interface UseCartItemActionsParams {
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;
  removeCartItem: (id: number) => Promise<void>;
}

export const useCartItemActions = ({
  updateItemQuantity,
  removeCartItem,
}: UseCartItemActionsParams) => {
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const onClickCountButton = async (
    id: number,
    type: CountAction,
    quantity: number,
  ) => {
    if (updatingItemId === id) {
      return;
    }

    const newQuantity = type === "increment" ? quantity + 1 : quantity - 1;
    setUpdatingItemId(id);

    try {
      await updateItemQuantity(id, newQuantity);
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItemId((currentId) => (currentId === id ? null : currentId));
    }
  };

  const onClickRemoveItem = async (id: number) => {
    setRemovingItemId(id);

    try {
      await removeCartItem(id);
      toast.success("Product removed from cart");
    } catch {
      toast.error("Failed to remove product from cart");
    } finally {
      setRemovingItemId((currentId) => (currentId === id ? null : currentId));
    }
  };

  return {
    removingItemId,
    updatingItemId,
    onClickCountButton,
    onClickRemoveItem,
  };
};
