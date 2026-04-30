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
        "flex min-h-[190px] w-full items-center justify-between flex-col rounded-xl p-3 text-center relative shadow-sm bg-white cursor-pointer transition-shadow hover:shadow-md",
        { "border border-primary": active },
        className,
      )}
      onClick={onClick}
    >
      {active && (
        <CircleCheck className="absolute top-2 right-2 h-5 w-5 text-primary" />
      )}

      {imageUrl && (
        <Image
          width={90}
          height={90}
          src={imageUrl}
          alt={name}
          className="h-[90px] w-[90px] object-contain object-center"
        />
      )}

      <div className="mt-2 flex flex-1 flex-col justify-between">
        <span className="line-clamp-2 text-xs leading-4">{name}</span>
        <span className="mt-2 font-bold text-sm">{price}$</span>
      </div>
    </div>
  );
};
