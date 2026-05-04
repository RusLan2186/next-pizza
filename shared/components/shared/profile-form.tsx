"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  formRegisterSchema,
  TFormRegisterValues,
} from "./modals/auth-moodal/forms/schemas";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Container } from "./container";
import { Title } from "./title";
import { FormInput } from "./form";
import { Button } from "../ui";
import { updateUserInfo } from "@/app/actions";

interface Props {
  data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: data?.fullName,
      email: data?.email,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });
      toast.success("Profile updated successfully", { icon: "✅" });
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Error updating profile", { icon: "❌" });
    }
  };

  const onClickSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <Container className="my-6 px-4 sm:my-10">
      <Title
        text={`Profile | ${data?.fullName}`}
        size="md"
        className="font-bold !text-[22px] sm:!text-[26px]"
      />

      <FormProvider {...form}>
        <form
          className="mt-8 flex w-full flex-col gap-5 sm:mt-10 sm:w-96"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormInput name="email" label="E-Mail" required />
          <FormInput name="fullName" label="Full Name" required />

          <FormInput
            type="password"
            name="password"
            label="New Password"
            required
          />
          <FormInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            required
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="text-base mt-10"
            type="submit"
          >
            Save
          </Button>

          <Button
            onClick={onClickSignOut}
            variant="secondary"
            disabled={form.formState.isSubmitting}
            className="text-base"
            type="button"
          >
            Sign Out
          </Button>
        </form>
      </FormProvider>
    </Container>
  );
};
