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
    <div
      className={cn(
        className,
        "relative flex flex-1 max-[1050px]:h-full max-[1050px]:flex-col",
      )}
    >
      <div className="flex items-center justify-center flex-1 relative w-full max-[1050px]:min-h-[260px] max-[1050px]:p-4">
        <img
          src={imageUrl}
          alt={name}
          className="relative left-2 top-2 transition-all z-[18] duration-300 object-cover w-[350px] h-[350px] max-[1050px]:left-0 max-[1050px]:top-0 max-[1050px]:w-[220px] max-[1050px]:h-[220px]"
        />
      </div>

      <div className="flex flex-col w-[490px] bg-[#f7f6f5] p-7 max-[1050px]:flex-1 max-[1050px]:w-full max-[1050px]:p-5">
        <h2 className="text-[28px] font-extrabold mb-2 leading-[32px] max-[1050px]:text-2xl max-[1050px]:leading-[30px]">
          {name}
        </h2>

        <Button
          loading={loading}
          onClick={onClickAdd}
          className="h-[47px] px-10 text-base rounded-[18px] w-full mt-auto max-[1050px]:mt-6"
        >
          Add to cart {price}$
        </Button>
      </div>
    </div>
  );
};
