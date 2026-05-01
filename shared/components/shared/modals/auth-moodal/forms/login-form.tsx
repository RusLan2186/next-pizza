import { FormProvider, useForm } from "react-hook-form";
import { formLoginSchema, TFormLoginValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "@/components/shared/title";
import { FormInput } from "@/components/shared/form";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface Props {
  onClose: () => void;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!resp?.ok) {
        throw Error();
      }

      toast.success("Login successful", { icon: "✅" });
      onClose();
    } catch (error) {
      console.error("Error [LOGIN]", error);
      toast.error("Login error", { icon: "❌" });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col justify-center gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <Title
              text="Log in to your account"
              size="sm"
              className="mb-3 !text-[18px] leading-7 font-bold sm:!text-[22px] sm:leading-8"
            />
          </div>
          <img
            src="/assets/phone-icon.png"
            alt="phone-icon"
            width={50}
            height={50}
            className="h-9 w-9 sm:h-12 sm:w-12"
          />
        </div>

        <FormInput name="email" label="Email" required />
        <FormInput name="password" label="Password" type="password" required />

        <Button
          loading={form.formState.isSubmitting}
          spinnerClassName="text-white"
          className="h-12 text-base"
          type="submit"
        >
          Sign In
        </Button>
      </form>
    </FormProvider>
  );
};
