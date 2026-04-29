"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

type PaymentStatusToastProps = {
  status: "success" | "error";
  message: string;
};

export const PaymentStatusToast = ({
  status,
  message,
}: PaymentStatusToastProps) => {
  const shownRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (shownRef.current) {
      return;
    }

    shownRef.current = true;

    if (status === "success") {
      toast.success(message, {
        icon: "✅",
        duration: 3000,
      });
    } else {
      toast.error(message, {
        icon: "❌",
        duration: 3000,
      });
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    if (nextParams.has("orderId")) {
      nextParams.delete("orderId");
      const nextQuery = nextParams.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl);
    }
  }, [message, pathname, router, searchParams, status]);

  return null;
};
