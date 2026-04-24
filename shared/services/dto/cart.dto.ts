import {
  Cart,
  CartItem,
  Ingredient,
  Product,
  ProductVariant,
} from "@prisma/client";

export type CartItemDTO = CartItem & {
  productItem: ProductVariant & {
    product: Product;
  };
  ingredients: Ingredient[];
};

export interface CartDTO extends Cart {
  cartItems: CartItemDTO[];
  totalAmount: number;
}

export interface CreateCartItemValues {
  productItemId: number;
  ingredients?: number[];
}
