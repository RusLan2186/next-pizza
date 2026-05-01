import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import Link from "next/link";

interface Props {
  title: string;
  text: string;
  className?: string;
  imageUrl?: string;
}

export const InfoBlock: React.FC<Props> = ({
  className,
  title,
  text,
  imageUrl,
}) => {
  return (
    <div
      className={cn(
        className,
        "flex w-full max-w-[840px] flex-col-reverse items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-12",
      )}
    >
      <div className="flex w-full flex-col items-center md:items-start">
        <div className="mx-auto w-full max-w-[445px] text-center md:mx-0 md:text-left">
          <Title
            size="lg"
            text={title}
            className="text-3xl leading-9 font-extrabold sm:text-[32px]"
          />
          <p className="text-base text-gray-400 sm:text-lg">{text}</p>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-[320px] flex-col items-center justify-center gap-3 sm:mx-0 sm:mt-11 sm:max-w-none sm:flex-row sm:justify-start sm:gap-5">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full justify-center gap-2 sm:w-auto"
            >
              <ArrowLeft />
              Back to main
            </Button>
          </Link>
          <a href="" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full justify-center border-gray-400 text-gray-500 hover:bg-gray-50 sm:w-auto"
            >
              Update page
            </Button>
          </a>
        </div>
      </div>

      <img src={imageUrl} alt={title} className="w-28 sm:w-44 md:w-[300px]" />
    </div>
  );
};
