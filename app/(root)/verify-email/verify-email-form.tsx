"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmail } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export const VerifyEmailForm: React.FC = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyEmail(code);
      toast.success("Email confirmed! You can now sign in.");
      router.push("/?auth=login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-extrabold">Confirm your email</h1>
      <p className="mb-6 text-sm text-gray-500">
        Enter the 6-digit code we sent to your email address.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="code" className="text-sm font-medium">
            Verification code
          </label>
          <Input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="h-12 text-center text-lg tracking-widest"
            required
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading || code.length < 6}
          className="h-12 w-full text-base"
        >
          {loading ? "Verifying…" : "Confirm"}
        </Button>
      </form>
    </div>
  );
};
