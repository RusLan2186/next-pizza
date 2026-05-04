import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { getUserSession } from "@/shared/lib/get-user-session";
import { NextRequest, NextResponse } from "next/server";

const resolveActiveCart = async (req: NextRequest) => {
  const session = await getUserSession();

  if (session?.id) {
    const userId = Number(session.id);
    if (!Number.isFinite(userId)) {
      return null;
    }

    return prisma.cart.findFirst({ where: { userId } });
  }

  const token = req.cookies.get("cartToken")?.value;
  if (!token) {
    return null;
  }

  return prisma.cart.findFirst({ where: { token, userId: null } });
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    const data = (await req.json()) as { quantity: number };
    const activeCart = await resolveActiveCart(req);

    if (!activeCart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cartId: activeCart.id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 },
      );
    }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity: data.quantity },
    });
    const updatedUserCart = await updateCartTotalAmount(activeCart.token);
    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.log("[CART_PATCH] Server error:", error);
    return NextResponse.json(
      { message: "Error updating cart item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const activeCart = await resolveActiveCart(req);

    if (!activeCart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cartId: activeCart.id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({
      where: { id },
    });
    const updatedUserCart = await updateCartTotalAmount(activeCart.token);
    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.log("[CART_DELETE] Server error:", error);
    return NextResponse.json(
      { message: "Error deleting cart item" },
      { status: 500 },
    );
  }
}
