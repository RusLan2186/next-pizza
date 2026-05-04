import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { getUserSession } from "@/shared/lib/get-user-session";

const emptyCart = { totalAmount: 0, cartItems: [] };

const cartInclude = {
  cartItems: {
    orderBy: {
      createdAt: "desc" as const,
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
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;
    const session = await getUserSession();

    if (session?.id) {
      const userId = Number(session.id);
      if (!Number.isFinite(userId)) {
        return NextResponse.json(emptyCart);
      }

      let userCart = await prisma.cart.findFirst({
        where: { userId },
        include: cartInclude,
      });

      if (!userCart && token) {
        const guestCart = await prisma.cart.findFirst({
          where: { token, userId: null },
          include: cartInclude,
        });

        if (guestCart) {
          userCart = await prisma.cart.update({
            where: { id: guestCart.id },
            data: { userId },
            include: cartInclude,
          });
        }
      }

      if (!userCart) {
        return NextResponse.json(emptyCart);
      }

      const response = NextResponse.json(userCart);
      if (token !== userCart.token) {
        response.cookies.set("cartToken", userCart.token, { path: "/" });
      }

      return response;
    }

    if (!token) {
      return NextResponse.json(emptyCart);
    }

    const guestCart = await prisma.cart.findFirst({
      where: { token, userId: null },
      include: cartInclude,
    });

    if (!guestCart) {
      const response = NextResponse.json(emptyCart);
      response.cookies.set("cartToken", crypto.randomUUID(), { path: "/" });
      return response;
    }

    return NextResponse.json(guestCart);
  } catch (error) {
    console.log("[CART_GET] Server error", error);
    return NextResponse.json(
      { message: "Error getting cart item" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get("cartToken")?.value;
    const session = await getUserSession();
    const userId = session?.id ? Number(session.id) : null;

    let userCart;

    if (userId && Number.isFinite(userId)) {
      userCart = await prisma.cart.findFirst({
        where: { userId },
      });

      if (!userCart && token) {
        const guestCart = await prisma.cart.findFirst({
          where: { token, userId: null },
        });

        if (guestCart) {
          userCart = await prisma.cart.update({
            where: { id: guestCart.id },
            data: { userId },
          });
        }
      }

      if (!userCart) {
        userCart = await prisma.cart.create({
          data: {
            token: crypto.randomUUID(),
            userId,
          },
        });
      }

      token = userCart.token;
    } else {
      if (!token) {
        token = crypto.randomUUID();
      }

      userCart = await prisma.cart.findFirst({
        where: {
          token,
          userId: null,
        },
      });

      if (!userCart) {
        const existingCartWithToken = await prisma.cart.findFirst({
          where: { token },
        });

        if (existingCartWithToken) {
          token = crypto.randomUUID();
        }

        userCart = await prisma.cart.create({
          data: { token },
        });
      }
    }

    const data = (await req.json()) as CreateCartItemValues;

    const existingCartItems = await prisma.cartItem.findMany({
      where: {
        cartId: userCart.id,
        productVariantId: data.productItemId,
      },
      include: {
        ingredients: true,
      },
    });

    const requestIngredientIds = (data.ingredients || []).sort((a, b) => a - b);

    const findCartItem = existingCartItems.find((item) => {
      const itemIngredientIds = item.ingredients
        .map((i) => i.id)
        .sort((a, b) => a - b);
      return (
        itemIngredientIds.length === requestIngredientIds.length &&
        itemIngredientIds.every((id, idx) => id === requestIngredientIds[idx])
      );
    });

    if (findCartItem) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + 1,
        },
      });

      const updatedUserCart = await updateCartTotalAmount(token!);
      const resp = NextResponse.json(updatedUserCart);
      resp.cookies.set("cartToken", token!);
      return resp;
    }

    await prisma.cartItem.create({
      data: {
        cartId: userCart.id,
        productVariantId: data.productItemId,
        quantity: 1,
        ingredients: {
          connect: data.ingredients?.map((id) => ({ id })),
        },
      },
    });

    const updatedUserCart = await updateCartTotalAmount(token!);
    const resp = NextResponse.json(updatedUserCart);
    resp.cookies.set("cartToken", token!);
    return resp;
  } catch (error) {
    console.log("[CART_POST] Server error", error);
    return NextResponse.json(
      { message: "Error creating cart item" },
      { status: 500 },
    );
  }
}
