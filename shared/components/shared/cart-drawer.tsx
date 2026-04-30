"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";
import { useTransition } from "react";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { Title } from "./title";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { useCart } from "@/shared/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useCartItemActions } from "@/shared/hooks/use-cart-item-actions";

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  const router = useRouter();
  const [isCheckoutPending, startCheckoutTransition] = useTransition();

  const { totalAmount, items, updateItemQuantity, removeCartItem } = useCart();
  const {
    removingItemId,
    updatingItemId,
    onClickCountButton,
    onClickRemoveItem,
  } = useCartItemActions({
    updateItemQuantity,
    removeCartItem,
  });

  const onClickCheckout = () => {
    startCheckoutTransition(() => {
      router.push("/checkout");
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className={
          "data-[side=right]:w-screen data-[side=right]:max-w-none sm:data-[side=right]:w-3/4 sm:data-[side=right]:max-w-sm flex flex-col justify-between pb-0 bg-[#F4F1EE] " +
          (className ?? "")
        }
      >
        <div
          className={cn(
            "flex flex-col h-full",
            !totalAmount && "justify-center",
          )}
        >
          <SheetHeader className={cn(!totalAmount && "sr-only")}>
            <SheetTitle>
              Your cart contains{" "}
              <span className="font-bold"> {items.length} items</span>
            </SheetTitle>
          </SheetHeader>

          {!totalAmount && (
            <div className="flex flex-col items-center justify-center  w-72 mx-auto">
              <Image
                src="/empty-box.png"
                alt="Empty cart"
                width={120}
                height={120}
              />
              <Title
                size="sm"
                text="Cart is empty"
                className="text-center font-bold my-2"
              />
              <p className="text-center text-neutral-500 mb-5">
                Please add anything to your cart yet.
              </p>

              <SheetClose asChild>
                <Button className="w-56 h-12 text-base" size="lg">
                  <ArrowLeft className="w-5 mr-2" />
                  Go back
                </Button>
              </SheetClose>
            </div>
          )}

          {totalAmount > 0 && (
            <>
              <div className="overflow-auto  flex-1">
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <CartDrawerItem
                      key={item.id}
                      id={item.id}
                      imageUrl={item.imageUrl}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      onClickCountButton={(type) =>
                        onClickCountButton(item.id, type, item.quantity)
                      }
                      onClickRemove={() => onClickRemoveItem(item.id)}
                      loading={removingItemId === item.id}
                      countLoading={updatingItemId === item.id}
                      details={getCartItemDetails(
                        item.ingredients,
                        item.pizzaType as PizzaType,
                        item.pizzaSize as PizzaSize,
                      )}
                    />
                  ))}
                </div>
              </div>

              <SheetFooter className="bg-white p-4 sm:p-8">
                <div>
                  <div className="flex mb-3 sm:mb-4">
                    <span className="flex flex-1 text-base sm:text-lg text-neutral-500">
                      Total
                      <div className="flex-1 border-b pb-6 sm:pb-8 border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                    </span>

                    <span className="font-bold text-base sm:text-lg">
                      {totalAmount} $
                    </span>
                  </div>
                  <Button
                    type="button"
                    className="w-full h-11 sm:h-12 text-sm sm:text-base"
                    loading={isCheckoutPending}
                    onClick={onClickCheckout}
                  >
                    Checkout
                    <ArrowRight className="w-5 ml-2" />
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
