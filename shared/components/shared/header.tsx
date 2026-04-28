import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";

interface Props {
  className?: string;
  hasSearch?: boolean;
  hasCart?: boolean;
}

export const Header: React.FC<Props> = ({ className, hasSearch = true, hasCart=true }) => {
  return (
    <header className={cn( "border-b", className)}>
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

        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-1 text-[16px]"
          >
            <User size={16} />
            Enter
          </Button>

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
