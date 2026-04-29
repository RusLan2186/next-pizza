import { LiqPayProvider } from "./providers/liqpay";
import {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentCallbackResult,
  PaymentProvider,
  VerifyPaymentCallbackInput,
} from "./types";

const getProvider = (): PaymentProvider => {
  const configuredProvider = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();

  if (!configuredProvider || configuredProvider === "liqpay") {
    return new LiqPayProvider();
  }

  return new LiqPayProvider();
};

export const createPayment = (
  input: CreatePaymentInput,
): CreatePaymentResult | null => {
  return getProvider().createPayment(input);
};

export const verifyPaymentCallback = (
  input: VerifyPaymentCallbackInput,
): boolean => {
  return getProvider().verifyCallback(input);
};

export const parsePaymentCallbackData = (base64Data: string) => {
  return getProvider().parseCallbackData(base64Data);
};

export const getPaymentStatus = async (
  paymentId: string,
): Promise<PaymentCallbackResult | null> => {
  return getProvider().getPaymentStatus(paymentId);
};
