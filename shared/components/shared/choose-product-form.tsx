import { cn } from "@/shared/lib/utils";
import { Button } from "../ui";

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  onClickAdd: () => void;
  loading?: boolean;
  className?: string;
}

export const ChooseProductForm: React.FC<Props> = ({
  imageUrl,
  name,
  price,
  onClickAdd,
  loading,
  className,
}) => {
  return (
    <div className={cn(className, "flex flex-1 relative")}>
      <div className="flex items-center justify-center flex-1 relative w-full">
        <img
          src={imageUrl}
          alt={name}
          className="relative left-2 top-2 transition-all z-[18] duration-300 object-cover w-[350px] h-[350px]"
        />
      </div>

      <div className="flex  flex-col w-[490px] bg-[#f7f6f5] p-7">
        <h2 className="text-[28px] font-extrabold mb-2 leading-[32px]">
          {name}
        </h2>

        <Button
          loading={loading}
          onClick={onClickAdd}
          className="h-[47px] px-10 text-base rounded-[18px] w-full mt-auto"
        >
          Add to cart {price}$
        </Button>
      </div>
    </div>
  );
};
