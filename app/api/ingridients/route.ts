import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  const ingridients = await prisma.ingridient.findMany();

  return NextResponse.json(ingridients);
}
