import { cn } from "@/shared/lib/utils";

interface Props {
  src: string;
  name: string;
  size?: 20 | 30 | 40;
  className?: string; // was required, should be optional
}

export const PizzaImage: React.FC<Props> = ({ src, name, size, className }) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[540px] w-full flex-1 items-center justify-center overflow-hidden max-[1050px]:min-h-[340px]",
        className,
      )}
    >
      <img
        className={cn(
          "relative left-2 top-2 z-[18] object-contain transition-all duration-300 max-[1050px]:left-0 max-[1050px]:top-0",
          {
            "h-[300px] w-[300px] max-[1050px]:h-[200px] max-[1050px]:w-[200px]":
              size === 20,
            "h-[400px] w-[400px] max-[1050px]:h-[250px] max-[1050px]:w-[250px]":
              size === 30,
            "h-[500px] w-[500px] max-[1050px]:h-[290px] max-[1050px]:w-[290px]":
              size === 40,
          },
        )}
        src={src}
        alt={name}
      />
    </div>
  );
};
