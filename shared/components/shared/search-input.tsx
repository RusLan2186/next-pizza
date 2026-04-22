"use client";

import { cn } from "@/shared/lib/utils";
import { Api } from "@/shared/services/api-client";
import { Product } from "@prisma/client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async (query: string) => {
    const response = await Api.products.search(query);
    setProducts(response);
  };

  useClickAway(ref, () => {
    setFocused(false);
  });

  useDebounce(
    async () => {
      try {
        await fetchProducts(searchQuery);
      } catch (error) {
        console.log(error);
      }
    },
    250,
    [searchQuery],
  );

  const onFocusInput = async () => {
    setFocused(true);
    if (products.length > 0) {
      return;
    }

    try {
      await fetchProducts("");
    } catch (error) {
      console.log(error);
    }
  };

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery("");
    setProducts([]);
  };

  return (
    <>
      {focused && (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30" />
      )}

      <div
        ref={ref}
        className={cn(
          "flex roundet-2xl flex-1 justify-between relative h-11 z-30",
          className,
        )}
      >
        <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />

        <input
          className="rounded-2xl outline-none w-full bg-gray-50 pl-11"
          placeholder="Search..."
          type="text"
          onFocus={onFocusInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {products.length > 0 && (
          <div
            className={cn(
              "absolute rounded-xl w-full bg-white roundet-xl py-2 top-14 shadow-md translion-all duration-200 invisible opacity-0 z-30",
              focused && "visible opacity-100 top-12",
            )}
          >
            {
              products
                .map((product) => (
                  <div key={product.id}>
                    <Link
                      onClick={onClickItem}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-primary/10"
                      href={`/product/${product.id}`}
                    >
                      <img
                        className="h-8 w-8 rounded-sm object-cover"
                        src={product.imageUrl}
                        alt={product.productName}
                      />

                      <span>{product.productName}</span>
                    </Link>
                  </div>
                ))
                .slice(0, 5)
              /* Limit to 5 results */
            }
          </div>
        )}
      </div>
    </>
  );
};
