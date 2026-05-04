"use client";

import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { ProfileButton } from "./profile-button";
import { CartButton } from "./cart-button";
import { AuthModal } from "./modals";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthModalControllerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function AuthModalController({
  isOpen,
  onOpen,
  onClose,
}: AuthModalControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoOpenAuth = searchParams.get("auth") === "login";
  const isModalOpen = isOpen || shouldAutoOpenAuth;

  useEffect(() => {
    if (!shouldAutoOpenAuth) return;
    router.replace("/", { scroll: false });
  }, [shouldAutoOpenAuth, router]);

  return (
    <>
      <AuthModal open={isModalOpen} onClose={onClose} />
      <ProfileButton onClickSignIn={onOpen} />
    </>
  );
}

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
          <Suspense fallback={<ProfileButton onClickSignIn={() => setIsAuthModalOpen(true)} />}>
            <AuthModalController
              isOpen={isAuthModalOpen}
              onOpen={() => setIsAuthModalOpen(true)}
              onClose={() => setIsAuthModalOpen(false)}
            />
          </Suspense>

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
