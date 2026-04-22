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

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
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
            Your cart contains <span className="font-bold"> 3 items</span>
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-auto  flex-1">
          <div className="flex flex-col gap-2">
            <CartDrawerItem
              id={1}
              imageUrl={"/pizza/pizza-1.png"}
              name="Margherita"
              price={9}
              quantity={1}
              details={getCartItemDetails(2, 30, [
                { ingredientName: "chicken" },
                { ingredientName: "cheese" },
              ])}
            />
          </div>
        </div>

        <SheetFooter className=" bg-white p-8">
          <div>
            <div className="flex mb-4 ">
              <span className="flex flex-1 text-lg text-neutral-500">
                Total
                <div className="flex-1 border-b pb-8 border-dashed border-b-neutral-200 relative -top-1 mx-2" />
              </span>

              <span className="font-bold text-lg">50 $</span>
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
