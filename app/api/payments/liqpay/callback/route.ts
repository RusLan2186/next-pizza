import {
  parsePaymentCallbackData,
  syncOrderPaymentStatus,
  verifyPaymentCallback,
} from "@/shared/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    console.log(
      "[LiqPay callback] incoming request, content-type:",
      contentType,
    );

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

    console.log(
      "[LiqPay callback] data length:",
      data.length,
      "signature length:",
      signature.length,
    );

    if (!data || !signature) {
      console.log("[LiqPay callback] missing payload");
      return NextResponse.json(
        { ok: false, message: "Missing callback payload" },
        { status: 400 },
      );
    }

    const isValid = verifyPaymentCallback({ data, signature });
    console.log("[LiqPay callback] signature valid:", isValid);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Invalid signature" },
        { status: 401 },
      );
    }

    const callback = parsePaymentCallbackData(data);
    console.log("[LiqPay callback] parsed callback:", callback);

    if (!callback.paymentId) {
      return NextResponse.json(
        { ok: false, message: "Missing paymentId" },
        { status: 400 },
      );
    }

    const syncResult = await syncOrderPaymentStatus({
      paymentId: callback.paymentId,
      status: callback.status,
    });

    console.log("[LiqPay callback] sync result:", syncResult);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[LiqPay callback] error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
