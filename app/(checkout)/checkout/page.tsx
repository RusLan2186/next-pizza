"use client";

import { FormProvider, useForm } from "react-hook-form";
import { CheckoutSidebar, Container, Title } from "@/components/shared";
import { useCart } from "@/shared/hooks/use-cart";
import { useCartItemActions } from "@/shared/hooks/use-cart-item-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckoutAdressForm,
  CheckoutCart,
  CheckoutPersonalForm,
} from "@/components/shared/checkout";
import {
  checkoutFormSchema,
  CheckoutFormValues,
} from "@/components/shared/checkout/checkout-schema";
import { cn } from "@/shared/lib/utils";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } =
    useCart();
  const isInitialCartLoading = loading && items.length === 0;
  const {
    removingItemId,
    updatingItemId,
    onClickCountButton,
    onClickRemoveItem,
  } = useCartItemActions({
    updateItemQuantity,
    removeCartItem,
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      adress: "",
      adressSuggestionId: "",
      comments: "",
    },
  });
  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setIsSubmitting(true);
      const url = await createOrder(data);
      toast.success("Order created successfully!", { icon: "✅" });

      if (url) {
        if (url.startsWith("http")) {
          window.location.assign(url);
        } else {
          router.push(url);
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setIsSubmitting(false);
      toast.error("Failed to create order. Please try again.", { icon: "❌" });
    }
  };

  return (
    <Container className="mt-6 px-1 md:mt-10 md:px-5">
      <Title
        text="Checkout"
        className="mb-6 text-[30px] font-extrabold md:mb-8 md:text-[36px]"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="order-last mb-10 flex flex-1 flex-col gap-6 lg:order-first lg:mb-20 lg:gap-10">
              <CheckoutCart
                items={items}
                onClickCountButton={onClickCountButton}
                onClickRemoveItem={onClickRemoveItem}
                updatingItemId={updatingItemId}
                removingItemId={removingItemId}
                loading={isInitialCartLoading}
              />

              <CheckoutPersonalForm
                className={cn({
                  "opacity-40 pointer-events-none": isInitialCartLoading,
                })}
              />

              <CheckoutAdressForm
                className={cn({
                  "opacity-40 pointer-events-none": isInitialCartLoading,
                })}
              />
            </div>

            <div className="order-first w-full lg:order-last lg:w-[450px] lg:shrink-0">
              <CheckoutSidebar
                totalAmount={totalAmount}
                loading={isInitialCartLoading || isSubmitting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
