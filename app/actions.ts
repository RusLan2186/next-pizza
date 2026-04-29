"use server";

import { PayOrderTemplate } from "@/components/shared/email-templates";
import { CheckoutFormValues } from "@/components/shared/checkout/checkout-schema";
import { prisma } from "@/prisma/prisma-client";
import { createPayment, sendEmail } from "@/shared/lib";
import {
  ORDER_DELIVERY_PRICE,
  ORDER_VAT_PERCENT,
} from "@/shared/constants/order";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = cookies();
    const cartToken = (await cookieStore).get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token is missing");
    }

    // находим корзину по токену и получаем её содержимое
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        cartItems: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty");
    }

    const subtotalAmount = userCart.totalAmount;
    const taxAmount = Number(
      ((subtotalAmount * ORDER_VAT_PERCENT) / 100).toFixed(2),
    );
    const totalAmount = Number(
      (subtotalAmount + ORDER_DELIVERY_PRICE + taxAmount).toFixed(2),
    );

    // создаем заказ
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        email: data.email,
        fullName: data.firstName + " " + data.lastName,
        phone: data.phone,
        address: data.adress,
        comment: data.comments,
        status: OrderStatus.PENDING,
        totalAmount,
        products: JSON.stringify(userCart.cartItems),
      },
    });

    const appUrl = process.env.APP_URL?.trim() || "http://localhost:3000";
    const resultUrl =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : appUrl;
    const payment = createPayment({
      orderId: order.id,
      amount: totalAmount,
      description: `Payment for order #${order.id}`,
      resultUrl: `${resultUrl}/?orderId=${order.id}`,
      callbackUrl: `${appUrl}/api/payments/liqpay/callback`,
      currency: "UAH",
    });

    const paymentUrl =
      payment?.paymentUrl || `${resultUrl}/?orderId=${order.id}`;

    if (payment?.paymentId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId: payment.paymentId },
      });
    }

    // очищаем totalAmount в корзине
    await prisma.cart.update({
      where: { token: cartToken },
      data: { totalAmount: 0 },
    });

    // и удаляем все товары из корзины
    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    // отправляем письмо с подтверждением заказа
    try {
      await sendEmail(
        data.email,
        "Next Pizza | Please pay for your order #" + order.id,
        PayOrderTemplate({
          orderId: order.id,
          subtotalAmount,
          taxAmount,
          deliveryAmount: ORDER_DELIVERY_PRICE,
          totalAmount,
          paymentUrl,
        }),
      );
    } catch (emailError) {
      console.error("[Create Order] Failed to send email:", emailError);
    }

    return paymentUrl;
  } catch (error) {
    console.error("[Create Order] Error creating order:", error);
    throw error;
  }
}
