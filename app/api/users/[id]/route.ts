import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("Deleting user with id:", id); // добавь это

    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("DELETE ERROR:", error); // и это
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
