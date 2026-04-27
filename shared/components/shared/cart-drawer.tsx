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
import Link from "next/link";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";
import { useCartStore } from "@/shared/store";
import { useEffect, useState } from "react";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import toast from "react-hot-toast";
import { Title } from "./title";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  const items = useCartStore((state) => state.items);
  const updateCartItemQuantity = useCartStore(
    (state) => state.updateItemQuantity,
  );

  const removeCartItem = useCartStore((state) => state.removeCartItem);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const onClickCountButton = async (
    id: number,
    type: "increment" | "decrement",
    quantity: number,
  ) => {
    if (updatingItemId === id) {
      return;
    }

    const newQuantity = type === "increment" ? quantity + 1 : quantity - 1;
    setUpdatingItemId(id);

    try {
      await updateCartItemQuantity(id, newQuantity);
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItemId((currentId) => (currentId === id ? null : currentId));
    }
  };

  const onClickRemoveItem = async (id: number) => {
    setRemovingItemId(id);

    try {
      await removeCartItem(id);
      toast.success("Product removed from cart");
    } catch {
      toast.error("Failed to remove product from cart");
    } finally {
      setRemovingItemId((currentId) => (currentId === id ? null : currentId));
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className={
          "flex flex-col justify-between pb-0 bg-[#F4F1EE] " + (className ?? "")
        }
      >
        <div
          className={cn(
            "flex flex-col h-full",
            !totalAmount && "justify-center",
          )}
        >
          {totalAmount > 0 && (
            <SheetHeader>
              <SheetTitle>
                Your cart contains{" "}
                <span className="font-bold"> {items.length} items</span>
              </SheetTitle>
            </SheetHeader>
          )}

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

              <SheetClose>
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
                      loading={removingItemId === item.id}
                      countLoading={updatingItemId === item.id}
                      onClickRemove={() => onClickRemoveItem(item.id)}
                      details={
                        item.pizzaSize && item.pizzaType
                          ? getCartItemDetails(
                              item.pizzaType as PizzaType,
                              item.pizzaSize as PizzaSize,
                              item.ingredients,
                            )
                          : ""
                      }
                    />
                  ))}
                </div>
              </div>

              <SheetFooter className=" bg-white p-8">
                <div>
                  <div className="flex mb-4 ">
                    <span className="flex flex-1 text-lg text-neutral-500">
                      Total
                      <div className="flex-1 border-b pb-8 border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                    </span>

                    <span className="font-bold text-lg">{totalAmount} $</span>
                  </div>
                  <Link href="/cart">
                    <Button type="submit" className="w-full h-12 text-base">
                      Checkout
                      <ArrowRight className="w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
