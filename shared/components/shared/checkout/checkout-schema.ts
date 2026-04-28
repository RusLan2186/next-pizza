import z from "zod/v3";

export const checkoutFormSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Enter a valid phone number"),
    adress: z.string().min(5, "Enter a valid address"),
    adressSuggestionId: z.string().optional(),
    comments: z.string().optional(),
  })
  .superRefine(({ adress, adressSuggestionId }, ctx) => {
    if (adress.trim().length >= 5 && !adressSuggestionId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["adress"],
        message: "Select an address from the list",
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
