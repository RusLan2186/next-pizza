import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
}

export const CheckoutItemSceleton: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-5">
        <div className="h-[50px] w-[50px] shrink-0 animate-pulse rounded-full bg-gray-200" />
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex items-center justify-between gap-4 md:contents">
        <div className="h-5 w-10 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-[133px] animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
};
