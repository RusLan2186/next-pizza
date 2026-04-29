import { ArrowRight, Package, Percent, Truck } from "lucide-react";
import { CheckoutItemDetails } from "./checkout-item-details";
import { WhiteBlock } from "./white-block";
import { Button, Skeleton } from "../ui";
import {
  ORDER_DELIVERY_PRICE,
  ORDER_VAT_PERCENT,
} from "@/shared/constants/order";

interface Props {
  totalAmount: number;
  loading?: boolean;
}

export const CheckoutSidebar: React.FC<Props> = ({ totalAmount, loading }) => {
  const vatPrice = (totalAmount * ORDER_VAT_PERCENT) / 100;
  const deliveryPrice = ORDER_DELIVERY_PRICE;
  const totalPrice = totalAmount + deliveryPrice + vatPrice;

  return (
    <WhiteBlock className="pb-4 sticky top-4">
      <div className="flex flex-col gap-1">
        <span className="text-xl">Total Price:</span>

        {loading ? (
          <Skeleton className="h-11 w-40" />
        ) : (
          <span className="text-[30px] font-extrabold">{`${totalPrice}`}$</span>
        )}
      </div>

      <CheckoutItemDetails
        title={
          <div className="flex items-center gap-2">
            <Package size={18} className="text-gray-300" />
            Cart price
          </div>
        }
        value={
          loading ? (
            <Skeleton className="h-6 w-14 rounded-[6px]" />
          ) : (
            `${totalAmount}$`
          )
        }
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center gap-2">
            <Percent size={18} className="text-gray-300" />
            Taxes ({ORDER_VAT_PERCENT}%)
          </div>
        }
        value={
          loading ? (
            <Skeleton className="h-6 w-14 rounded-[6px]" />
          ) : (
            `${vatPrice}$`
          )
        }
      />

      <CheckoutItemDetails
        title={
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-gray-300" />
            Delivery
          </div>
        }
        value={
          loading ? (
            <Skeleton className="h-6 w-12 rounded-[6px]" />
          ) : (
            `${ORDER_DELIVERY_PRICE}$`
          )
        }
      />
      <Button
        type="submit"
        loading={loading}
        className="w-full h-12 rounded-2xl mt-6 text-base font-bold"
      >
        Proceed to checkout
        <ArrowRight className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
