"use server";

import {
  PayOrderTemplate,
  VerificationUserTemplate,
} from "@/components/shared/email-templates";
import { CheckoutFormValues } from "@/components/shared/checkout/checkout-schema";
import { prisma } from "@/prisma/prisma-client";
import { createPayment, sendEmail } from "@/shared/lib";
import {
  ORDER_DELIVERY_PRICE,
  ORDER_VAT_PERCENT,
} from "@/shared/constants/order";
import { OrderStatus, Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { getUserSession } from "@/shared/lib/get-user-session";
import { hashSync } from "bcrypt";

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

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        email: body.email,
        fullName: body.fullName,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password,
      },
    });
  } catch (error) {
    console.error("[Update User] Error updating user info:", error);
    throw error;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user?.verified) {
      throw new Error("User already exists");
    }

    const targetUser =
      user ??
      (await prisma.user.create({
        data: {
          email: body.email,
          fullName: body.fullName,
          password: hashSync(String(body.password), 10),
        },
      }));

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.upsert({
      where: {
        userId: targetUser.id,
      },
      update: {
        code,
        createdAt: new Date(),
      },
      create: {
        code,
        userId: targetUser.id,
      },
    });

    const appUrl = process.env.APP_URL?.trim() || "http://localhost:3000";
    const publicAppUrl =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : appUrl;
    const confirmUrl = `${publicAppUrl}/verify-email?code=${code}`;

    await sendEmail(
      targetUser.email,
      "Next Pizza | Confirm your account ",
      VerificationUserTemplate({
        code,
        confirmUrl,
      }),
    );
  } catch (error) {
    console.error("[Create User] Error registering user:", error);
    throw error;
  }
}

export async function verifyEmail(code: string): Promise<void> {
  if (!code?.trim()) {
    throw new Error("Please enter the verification code.");
  }

  const verificationCode = await prisma.verificationCode.findFirst({
    where: { code: code.trim() },
  });

  if (!verificationCode) {
    throw new Error("Invalid or expired verification code.");
  }

  await prisma.user.update({
    where: { id: verificationCode.userId },
    data: { verified: new Date() },
  });

  await prisma.verificationCode.delete({
    where: { id: verificationCode.id },
  });
}
