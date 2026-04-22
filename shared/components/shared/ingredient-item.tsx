import { cn } from "@/shared/lib/utils";
import { CircleCheck } from "lucide-react";
import Image from "next/image";

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  active?: boolean;
  onClick: () => void;
  className?: string;
}

export const IngredientItem: React.FC<Props> = ({
  className,
  imageUrl,
  name,
  price,
  active,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex items-center flex-col p-1 rounded-md w-32 text-center relative shadow-md bg-white cursor-pointer",
        { "border border-primary": active },
        className,
      )} onClick={onClick}
    >
      {active && (
        <CircleCheck className="absolute top-2 right-2 text-primary" />
      )}

      {imageUrl && (
        <Image
          width={110}
          height={110}
          src={imageUrl}
          alt={name}
          className="object-cover object-center"
        />
      )}

      <span className="text-xs mb-1">{name}</span>
      <span className="font-bold">{price}$</span>
    </div>
  );
};
