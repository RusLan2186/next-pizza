export interface CreatePaymentInput {
  orderId: number;
  amount: number;
  description: string;
  resultUrl: string;
  callbackUrl: string;
  currency?: string;
}

export interface CreatePaymentResult {
  provider: string;
  paymentId: string;
  paymentUrl: string;
}

export interface PaymentCallbackResult {
  paymentId: string;
  status: "success" | "canceled" | "pending";
  rawStatus: string;
}

export interface VerifyPaymentCallbackInput {
  data: string;
  signature: string;
}

export interface PaymentProvider {
  providerName: string;
  createPayment(input: CreatePaymentInput): CreatePaymentResult | null;
  verifyCallback(input: VerifyPaymentCallbackInput): boolean;
  parseCallbackData(base64Data: string): PaymentCallbackResult;
}
