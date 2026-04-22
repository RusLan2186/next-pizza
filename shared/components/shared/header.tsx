import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn(" border border-b ", className)}>
      <Container className="flex items-center justify-between gap-3 py-4">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/logo.png" alt="logo" width={35} height={35}></Image>
          <div className="flex flex-col gap-0.4">
            <h1 className="text-xl uppercase font-black">Next pizza</h1>
            <p className="text-sm text-gray-400 leading-3">
              Delicious pizza delivered to your door
            </p>
          </div>
        </Link>

        <div className="mx-10 flex-1">
          <SearchInput />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-1 text-[16px]"
          >
            <User size={16} />
            Enter
          </Button>

          <div>
            <Button className="group relative">
              <b>10$</b>

              <span className="h-full w-[1px] bg-white/30 mx-3"></span>
              <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                <ShoppingCart size={16} className=" relative" />
                <b>3</b>
              </div>
              <ArrowRight
                size={20}
                className="absolute right-5 opacity-0 transition duration-300 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
