import { cn } from "@/shared/lib/utils";
import * as CartItem from "./cart-item-details";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import { CountButton } from "./count-button";
import { Loader2, Trash2Icon } from "lucide-react";

interface Props extends CartItemProps {
  className?: string;
  loading?: boolean;
  countLoading?: boolean;
  onClickCountButton?: (type: "increment" | "decrement") => void;
  onClickRemove?: () => void;
}

export const CartDrawerItem: React.FC<Props> = ({
  imageUrl,
  name,
  price,
  quantity,
  details,
  className,
  loading,
  countLoading,
  onClickCountButton,
  onClickRemove,
}) => {
  return (
    <div className={cn("flex bg-white p-5 gap-6", className)}>
      <CartItem.Image src={imageUrl} />

      <div className="flex-1">
        <CartItem.Info name={name} details={details} />

        <hr className="my-3" />

        <div className="flex items-center justify-between">
          <CountButton
            onClick={onClickCountButton}
            value={quantity}
            loading={countLoading}
          />

          <div className="flex items-center gap-3">
            <CartItem.Price value={price} />
            {loading ? (
              <Loader2 className="text-gray-400 animate-spin" size={16} />
            ) : (
              <Trash2Icon
                onClick={onClickRemove}
                className="text-gray-400 cursor-pointer hover:text-gray-600"
                size={16}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
