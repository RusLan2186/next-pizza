import { prisma } from "@/prisma/prisma-client";
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price";

export const updateCartTotalAmount = async (token: string) => {
  const userCart = await prisma.cart.findFirst({
    where: {
      token,
    },
    include: {
      cartItems: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          productItem: {
            include: {
              product: true,
            },
          },
          ingredients: true,
        },
      },
    },
  });

  if (!userCart) {
    return;
  }

  const totalAmount = userCart.cartItems.reduce((total, item) => {
    return total + calcCartItemTotalPrice(item);
  }, 0);

  return await prisma.cart.update({
    where: { token },
    data: { totalAmount },
    include: {
      cartItems: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          productItem: {
            include: {
              product: true,
            },
          },
          ingredients: true,
        },
      },
    },
  });
};
