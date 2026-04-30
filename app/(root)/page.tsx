import {
  Container,
  Filters,
  PaymentStatusToast,
  ProductsListGroup,
  Title,
  TopBar,
} from "@/components/shared";

import { prisma } from "@/prisma/prisma-client";
import { OrderStatus } from "@prisma/client";
import { getPaymentStatus, syncOrderPaymentStatus } from "@/shared/lib";

import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizza";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  let paymentToast: {
    status: "success" | "error";
    message: string;
  } | null = null;

  const rawOrderId = Array.isArray(resolvedSearchParams.orderId)
    ? resolvedSearchParams.orderId[0]
    : resolvedSearchParams.orderId;
  const orderId = Number(rawOrderId);

  if (Number.isFinite(orderId) && orderId > 0) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, paymentId: true, status: true },
    });

    let currentStatus = order?.status ?? null;

    if (order?.paymentId && order.status === OrderStatus.PENDING) {
      const paymentStatus = await getPaymentStatus(order.paymentId);

      if (paymentStatus) {
        const syncResult = await syncOrderPaymentStatus({
          paymentId: order.paymentId,
          status: paymentStatus.status,
        });

        currentStatus = syncResult.order?.status ?? currentStatus;
      }
    }

    if (currentStatus === OrderStatus.SUCCEEDED) {
      paymentToast = {
        status: "success",
        message: `Payment successful. Order #${orderId} is now being processed.`,
      };
    }

    if (currentStatus === OrderStatus.CANCELED) {
      paymentToast = {
        status: "error",
        message: `Payment failed for order #${orderId}. Please try again.`,
      };
    }
  }

  const categories = await findPizzas(resolvedSearchParams);

  return (
    <>
      {paymentToast && (
        <PaymentStatusToast
          status={paymentToast.status}
          message={paymentToast.message}
        />
      )}
      <Container className="mt-6 md:mt-10">
        <Title
          text="All pizzas"
          size="lg"
          className="font-extrabold mb-3 md:mb-5"
        />
      </Container>
      <TopBar
        categories={categories.filter(
          (category) => category.products.length > 0,
        )}
      />

      <Container className="pb-14 mt-10">
        <div className="flex gap-0 md:gap-6 lg:gap-10 xl:gap-[100px]">
          {/* Desktop sidebar filters */}
          <div className="hidden md:block w-[250px] shrink-0">
            <Suspense>
              <Filters />
            </Suspense>
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                (categorie) =>
                  categorie.products.length > 0 && (
                    <ProductsListGroup
                      key={categorie.id}
                      title={categorie.categoryName}
                      products={categorie.products}
                      categoryId={categorie.id}
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
