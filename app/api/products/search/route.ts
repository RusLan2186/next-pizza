import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") || "";

  const products = await prisma.product.findMany({
    where: query
      ? {
          productName: {
            contains: query,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: {
      id: "asc",
    },
    take: 5,
  });

  return NextResponse.json(products);
}
