"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "../store";
import { CreateCartItemValues } from "../services/dto/cart.dto";
import { CartStateItem } from "../lib/get-cart-details";

type ReturnProps = {
  totalAmount: number;
  items: CartStateItem[];
  loading: boolean;
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;
  removeCartItem: (id: number) => Promise<void>;
  addCartItem: (values: CreateCartItemValues) => Promise<void>;
};

export const useCart = (): ReturnProps => {
  const cartState = useCartStore((state) => state);
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  const { status, data: session } = useSession();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems, status, session?.user?.id]);

  return cartState;
};
