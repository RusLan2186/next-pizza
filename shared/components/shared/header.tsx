"use client";

import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { ProfileButton } from "./profile-button";
import { CartButton } from "./cart-button";
import { AuthModal } from "./modals";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  className?: string;
  hasSearch?: boolean;
  hasCart?: boolean;
}

export const Header: React.FC<Props> = ({
  className,
  hasSearch = true,
  hasCart = true,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoOpenAuth = searchParams.get("auth") === "login";
  const isModalOpen = isAuthModalOpen || shouldAutoOpenAuth;

  useEffect(() => {
    if (!shouldAutoOpenAuth) {
      return;
    }

    router.replace("/", { scroll: false });
  }, [shouldAutoOpenAuth, router]);

  return (
    <header className={cn("border-b", className)}>
      <Container className="flex items-center justify-between gap-3 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image src="/logo.png" alt="logo" width={35} height={35} />
          <div className="hidden sm:flex flex-col gap-0.5">
            <h1 className="text-xl font-black uppercase transition-colors group-hover:text-primary">
              Next pizza
            </h1>
            <p className="text-sm text-gray-400 leading-3">
              Delicious pizza delivered to your door
            </p>
          </div>
        </Link>

        {/* Search */}
        {hasSearch && (
          <div className="hidden md:flex flex-1 mx-6">
            <SearchInput />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <AuthModal
            open={isModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
          <ProfileButton onClickSignIn={() => setIsAuthModalOpen(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>

      {/* Mobile search */}
      {hasSearch && (
        <div className="md:hidden px-4 pb-3">
          <SearchInput />
        </div>
      )}
    </header>
  );
};
