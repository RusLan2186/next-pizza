"use client";

import { Button } from "@/components/ui/button";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFormRegisterValues, formRegisterSchema } from "./schemas";
import toast from "react-hot-toast";
import { FormInput } from "@/components/shared/form";
import { registerUser } from "@/app/actions";

interface Props {
  onClose?: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      await registerUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.success("Registration successful. Check your email to confirm.");
      onClose?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to register. Please try again.";

      return toast.error(message);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="fullName" label="Full Name" required />
        <FormInput name="password" label="Password" type="password" required />
        <FormInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          required
        />

        <Button
          loading={form.formState.isSubmitting}
          className="h-12 text-base"
          type="submit"
        >
          Register
        </Button>
      </form>
    </FormProvider>
  );
};
