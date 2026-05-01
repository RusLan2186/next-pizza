import z from "zod/v3";

export const passwordSchema = z
  .string()
  .min(4, { message: "Enter a valid password" });

export const formLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
});

export const formRegisterSchema = formLoginSchema.merge(
  z.object({
    fullName: z.string().min(2, { message: "Enter your fullname" }),
    confirmPassword: passwordSchema,
  }),
).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match", path: ["confirmPassword"],      
});


export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;