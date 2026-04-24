"use client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui";
import Link from "next/link";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";
import { useCartStore } from "@/shared/store";
import { useEffect } from "react";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
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

  const onClickCountButton = (
    id: number,
    type: "increment" | "decrement",
    quantity: number,
  ) => {
    const newQuantity = type === "increment" ? quantity + 1 : quantity - 1;
    updateCartItemQuantity(id, newQuantity);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className={
          "flex flex-col justify-between pb-0 bg-[#F4F1EE] " + (className ?? "")
        }
      >
        <SheetHeader>
          <SheetTitle>
            Your cart contains{" "}
            <span className="font-bold"> {items.length} items</span>
          </SheetTitle>
        </SheetHeader>

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
                onClickRemove={() => removeCartItem(item.id)}
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
      </SheetContent>
    </Sheet>
  );
};
