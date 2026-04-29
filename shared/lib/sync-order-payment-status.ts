import { prisma } from "@/prisma/prisma-client";
import {
  OrderCanceledTemplate,
  OrderSuccessTemplate,
} from "@/shared/components/shared/email-templates";
import { OrderStatus } from "@prisma/client";
import { sendEmail } from "./send-email";

type SyncOrderPaymentStatusInput = {
  paymentId: string;
  status: "success" | "canceled" | "pending";
};

type SyncOrderPaymentStatusResult = {
  order: {
    id: number;
    status: OrderStatus;
  } | null;
  updated: boolean;
};

const terminalStatusMap = {
  success: OrderStatus.SUCCEEDED,
  canceled: OrderStatus.CANCELED,
} as const;

export const syncOrderPaymentStatus = async ({
  paymentId,
  status,
}: SyncOrderPaymentStatusInput): Promise<SyncOrderPaymentStatusResult> => {
  const order = await prisma.order.findFirst({
    where: { paymentId },
  });

  if (!order) {
    return { order: null, updated: false };
  }

  if (status === "pending") {
    return {
      order: { id: order.id, status: order.status },
      updated: false,
    };
  }

  const nextStatus = terminalStatusMap[status];

  if (order.status !== OrderStatus.PENDING) {
    return {
      order: { id: order.id, status: order.status },
      updated: false,
    };
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: nextStatus },
  });

  if (nextStatus === OrderStatus.SUCCEEDED) {
    await sendEmail(
      updatedOrder.email,
      `Order #${updatedOrder.id} successfully paid`,
      OrderSuccessTemplate({
        orderId: updatedOrder.id,
        totalAmount: updatedOrder.totalAmount,
      }),
    );
  }

  if (nextStatus === OrderStatus.CANCELED) {
    await sendEmail(
      updatedOrder.email,
      `Payment for order #${updatedOrder.id} failed`,
      OrderCanceledTemplate({ orderId: updatedOrder.id }),
    );
  }

  return {
    order: { id: updatedOrder.id, status: updatedOrder.status },
    updated: true,
  };
};
