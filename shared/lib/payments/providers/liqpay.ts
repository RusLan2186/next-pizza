import crypto from "crypto";
import {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentCallbackResult,
  PaymentProvider,
  VerifyPaymentCallbackInput,
} from "../types";

const LIQPAY_CHECKOUT_URL = "https://www.liqpay.ua/api/3/checkout";

const SUCCESS_STATUSES = new Set(["success", "sandbox", "wait_accept"]);
const CANCELED_STATUSES = new Set([
  "failure",
  "error",
  "reversed",
  "unsubscribed",
]);

const encodeBase64 = (value: string) => Buffer.from(value).toString("base64");

const decodeBase64 = (value: string) =>
  Buffer.from(value, "base64").toString("utf-8");

const createSignature = (privateKey: string, data: string) =>
  crypto
    .createHash("sha1")
    .update(privateKey + data + privateKey)
    .digest("base64");

export class LiqPayProvider implements PaymentProvider {
  providerName = "liqpay";

  createPayment(input: CreatePaymentInput): CreatePaymentResult | null {
    const publicKey = process.env.LIQPAY_PUBLIC_KEY?.trim();
    const privateKey = process.env.LIQPAY_PRIVATE_KEY?.trim();

    if (!publicKey || !privateKey) {
      return null;
    }

    const paymentId = `liqpay-order-${input.orderId}-${Date.now()}`;

    const payload = {
      version: 3,
      public_key: publicKey,
      action: "pay",
      amount: Number(input.amount.toFixed(2)),
      currency: input.currency || "UAH",
      description: input.description,
      order_id: paymentId,
      result_url: input.resultUrl,
      server_url: input.callbackUrl,
      sandbox: 1,
    };

    const data = encodeBase64(JSON.stringify(payload));
    const signature = createSignature(privateKey, data);
    const paymentUrl = `${LIQPAY_CHECKOUT_URL}?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`;

    return {
      provider: this.providerName,
      paymentId,
      paymentUrl,
    };
  }

  verifyCallback(input: VerifyPaymentCallbackInput): boolean {
    const privateKey = process.env.LIQPAY_PRIVATE_KEY?.trim();
    if (!privateKey) return false;

    const expected = createSignature(privateKey, input.data);
    return expected === input.signature;
  }

  parseCallbackData(base64Data: string): PaymentCallbackResult {
    const payload = JSON.parse(decodeBase64(base64Data)) as {
      order_id?: string;
      status?: string;
    };

    const rawStatus = payload.status || "unknown";
    let status: PaymentCallbackResult["status"] = "pending";

    if (SUCCESS_STATUSES.has(rawStatus)) status = "success";
    if (CANCELED_STATUSES.has(rawStatus)) status = "canceled";

    return {
      paymentId: payload.order_id || "",
      status,
      rawStatus,
    };
  }
}
