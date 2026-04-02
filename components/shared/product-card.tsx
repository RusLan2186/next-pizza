import {Plus } from "lucide-react";
import React from "react";
import { Title } from "@/components/shared";
import { Button } from "../ui";
import Link from "next/link";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  className,
}) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`} className="flex flex-col h-full">
        <div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
          <img src={imageUrl} alt={name} width={215} height={215} />
        </div>

        <div className="flex flex-col h-full grow">
          <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
          <p className="text-sm text-gray-400 mb-3">
            Цыпленок, моцарелла, сыры чеддер и пармезан, сырный соус, томаты,
            соус альфредо, чеснок
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[18px] lowercase">
              from <b>{price}$</b>
            </span>
            <Button
              variant="secondary"
              className="flex center gap-[1px] text-base font-bold"
            >
              <Plus size={20} />
              Add
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};
