"use client";
import { useSession } from "next-auth/react";
import { Button } from "../ui";
import { CircleUser, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
  onClickSignIn?: () => void;
}

export const ProfileButton: React.FC<Props> = ({
  className,
  onClickSignIn,
}) => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <>
      {!session ? (
        <Button
          onClick={onClickSignIn}
          loading={isLoading}
          variant="outline"
          className={cn(
            "flex items-center gap-1 text-[16px]",
            isLoading && "text-white",
            className,
          )}
        >
          <User size={16} />
          <span className="hidden sm:inline">Login</span>
        </Button>
      ) : (
        <Link href="/profile">
          <Button
            loading={isLoading}
            variant="secondary"
            className={cn(
              "flex items-center gap-2",
              isLoading && "text-white",
              className,
            )}
          >
            <CircleUser size={16} />
            {session.user?.name ? session.user.name : "Profile"}
          </Button>
        </Link>
      )}
    </>
  );
};
