import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    const data = (await req.json()) as { quantity: number };
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Cart token is missing" },
        { status: 400 },
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id },
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
    const updatedUserCart = await updateCartTotalAmount(token);
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
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Cart token is missing" },
        { status: 400 },
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number((await params).id),
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({
      where: { id: Number((await params).id) },
    });
    const updatedUserCart = await updateCartTotalAmount(token);
    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.log("[CART_DELETE] Server error:", error);
    return NextResponse.json(
      { message: "Error deleting cart item" },
      { status: 500 },
    );
  }
}
