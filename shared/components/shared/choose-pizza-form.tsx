"use client";

import { cn } from "@/shared/lib/utils";
import { PizzaImage } from "./pizza-image";
import { Button } from "../ui";
import { DialogTitle } from "../ui/dialog";
import { GroupVariants } from "./group-variants";
import { mapPizzaType, PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { useMemo, useState } from "react";
import { IngredientItem } from "./ingredient-item";
import { Ingredient, ProductVariant } from "@prisma/client";
import { useSet } from "react-use";
import {
  calcTotalPizzaPrice,
  getAvailablePizzaSizes,
  getAvailablePizzaTypes,
  getFirstAvailablePizzaSize,
} from "@/shared/lib";

interface Props {
  imageUrl: string;
  name: string;
  items: ProductVariant[];
  ingredients?: Ingredient[];
  onClickAddCart?: (productItemId: number, ingredients: number[]) => void;
  className?: string;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  imageUrl,
  name,
  items,
  ingredients,
  onClickAddCart,
  className,
}) => {
  const defaultPizzaVariant = items.find(
    (item) => item.pizzaType && item.size,
  ) ?? {
    pizzaType: 1,
    size: 20,
  };

  const [size, setSize] = useState<PizzaSize>(
    defaultPizzaVariant.size as PizzaSize,
  );
  const [type, setType] = useState<PizzaType>(
    defaultPizzaVariant.pizzaType as PizzaType,
  );

  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<number>([]),
  );

  const availablePizzaTypes = useMemo(
    () => getAvailablePizzaTypes(items),
    [items],
  );

  const availablePizzaSizes = useMemo(
    () => getAvailablePizzaSizes(type, items),
    [type, items],
  );

  const onSelectType = (t: string) => {
    const newType = Number(t) as PizzaType;
    setType(newType);

    const sizesForNewType = getAvailablePizzaSizes(newType, items);
    const isSizeAvailable = sizesForNewType.some(
      (s) => s.value === String(size) && !s.disabled,
    );

    if (!isSizeAvailable) {
      const firstAvailableSize = getFirstAvailablePizzaSize(newType, items);
      if (firstAvailableSize) setSize(firstAvailableSize as PizzaSize);
    }
  };

  const totalPrice = calcTotalPizzaPrice({
    items,
    ingredients: ingredients ?? [],
    selectedIngredients,
    size,
    type,
  });

  const textDetails = `${size}cm, ${mapPizzaType[type]} pizza`;

  const handleClickAddCart = () => {
    const currentVariant = items.find(
      (item) => item.size === size && item.pizzaType === type,
    );
    if (currentVariant) {
      onClickAddCart?.(currentVariant.id, Array.from(selectedIngredients));
    }
  };

  return (
    <div className={cn(className, "flex flex-1 relative")}>
      <PizzaImage src={imageUrl} name={name} size={size} />

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <DialogTitle className=" text-[28px] font-extrabold mb-2 leading-[32px]">
          {name}
        </DialogTitle>

        <p className="text-grey-400 mb-5"> {textDetails}</p>

        <div className="flex flex-col gap-3 mb-5">
          <GroupVariants
            items={availablePizzaSizes}
            value={String(size)}
            onClick={(value) => setSize(Number(value) as PizzaSize)}
          />

          <GroupVariants
            items={availablePizzaTypes}
            value={String(type)}
            onClick={onSelectType}
          />
        </div>

        <div className="bg-gray-50 p-5 rounded-md h-[420px] overflow-auto scrollbar">
          <div className="grid grid-cols-3 gap-3">
            {ingredients?.map((ingredient) => (
              <IngredientItem
                key={ingredient.id}
                name={ingredient.ingredientName}
                imageUrl={ingredient.imageUrl}
                price={ingredient.price}
                onClick={() => addIngredient(ingredient.id)}
                active={selectedIngredients.has(ingredient.id)}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleClickAddCart}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
        >
          Add to cart {totalPrice}$
        </Button>
      </div>
    </div>
  );
};
