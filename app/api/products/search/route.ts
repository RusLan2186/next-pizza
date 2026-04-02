import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") || "";

  const products = await prisma.product.findMany({
    where: {
      productName: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10,
  });

  return NextResponse.json(products);
}
