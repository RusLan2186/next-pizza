import { getCartItemDetails } from "@/shared/lib";
import { CheckoutItem } from "../checkout-item";
import { WhiteBlock } from "../white-block";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { CartStateItem } from "@/shared/lib/get-cart-details";
import { CheckoutItemSceleton } from "../checkout-item-sceleton";

interface Props {
  items: CartStateItem[];
  onClickCountButton: (
    id: number,
    type: "increment" | "decrement",
    quantity: number,
  ) => void;
  onClickRemoveItem: (id: number) => void;
  updatingItemId: number | null;
  removingItemId: number | null;
  loading?: boolean;
  className?: string;
}

export const CheckoutCart: React.FC<Props> = ({
  items,
  onClickCountButton,
  onClickRemoveItem,
  updatingItemId,
  removingItemId,
  loading,
  className,
}) => {
  return (
    <WhiteBlock className={className} title="1. Cart">
      <div className="flex flex-col gap-4 md:gap-5">
        {loading &&
          items.length === 0 &&
          [...Array(4)].map((_, i) => <CheckoutItemSceleton key={i} />)}
        {items.map((item) => (
          <CheckoutItem
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            price={item.price}
            quantity={item.quantity}
            details={getCartItemDetails(
              item.ingredients,
              item.pizzaType as PizzaType,
              item.pizzaSize as PizzaSize,
            )}
            onClickCountButton={(type) =>
              onClickCountButton(item.id, type, item.quantity)
            }
            onClickRemove={() => onClickRemoveItem(item.id)}
            countLoading={updatingItemId === item.id}
            removeLoading={removingItemId === item.id}
          />
        ))}
      </div>
    </WhiteBlock>
  );
};
