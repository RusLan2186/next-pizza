"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Loader2, X } from "lucide-react";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import * as CartItemDetails from "./cart-item-details";

interface Props extends CartItemProps {
  onClickRemove?: () => void;
  onClickCountButton?: (type: "increment" | "decrement") => void;
  countLoading?: boolean;
  removeLoading?: boolean;
  className?: string;
}

export const CheckoutItem: React.FC<Props> = ({
  name,
  price,
  imageUrl,
  quantity,
  details,
  className,
  onClickCountButton,
  onClickRemove,
  countLoading,
  removeLoading,
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-5 flex-1">
        <CartItemDetails.Image src={imageUrl} />
        <CartItemDetails.Info name={name} details={details} />
      </div>

      <CartItemDetails.Price value={price} className="w-20 text-right" />

      <div className="ml-20 flex items-center gap-5">
        <CartItemDetails.CountButton
          onClick={onClickCountButton}
          value={quantity}
          loading={countLoading}
        />
        <div className="flex w-5 items-center justify-center">
          {removeLoading ? (
            <Loader2 className="animate-spin text-gray-400" size={20} />
          ) : (
            <button type="button" onClick={onClickRemove}>
              <X
                className="cursor-pointer text-gray-400 hover:text-gray-600"
                size={20}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
