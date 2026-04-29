import { prisma } from "@/prisma/prisma-client";
import { parsePaymentCallbackData, verifyPaymentCallback } from "@/shared/lib";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let data = "";
    let signature = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      data = body?.data || "";
      signature = body?.signature || "";
    } else {
      const formData = await request.formData();
      data = String(formData.get("data") || "");
      signature = String(formData.get("signature") || "");
    }

    if (!data || !signature) {
      return NextResponse.json(
        { ok: false, message: "Missing callback payload" },
        { status: 400 },
      );
    }

    const isValid = verifyPaymentCallback({ data, signature });
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Invalid signature" },
        { status: 401 },
      );
    }

    const callback = parsePaymentCallbackData(data);
    if (!callback.paymentId) {
      return NextResponse.json(
        { ok: false, message: "Missing paymentId" },
        { status: 400 },
      );
    }

    if (callback.status === "success") {
      await prisma.order.updateMany({
        where: { paymentId: callback.paymentId },
        data: { status: OrderStatus.SUCCEEDED },
      });
    }

    if (callback.status === "canceled") {
      await prisma.order.updateMany({
        where: { paymentId: callback.paymentId },
        data: { status: OrderStatus.CANCELED },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[LiqPay callback] error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
