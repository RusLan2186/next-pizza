import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findOrCreateCart } from "@/shared/lib/find-or-create-cart";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, cartItems: [] });
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [{ token }],
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
      return NextResponse.json({ totalAmount: 0, cartItems: [] });
    }

    return NextResponse.json(userCart);
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

    if (!token) {
      token = crypto.randomUUID();
    }

    const userCart = await findOrCreateCart(token);

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

      const updatedUserCart = await updateCartTotalAmount(token);
      const resp = NextResponse.json(updatedUserCart);
      resp.cookies.set("cartToken", token);
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

    const updatedUserCart = await updateCartTotalAmount(token);
    const resp = NextResponse.json(updatedUserCart);
    resp.cookies.set("cartToken", token);
    return resp;
  } catch (error) {
    console.log("[CART_POST] Server error", error);
    return NextResponse.json(
      { message: "Error creating cart item" },
      { status: 500 },
    );
  }
}
