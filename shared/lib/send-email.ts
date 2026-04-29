import { Resend } from "resend";

export const sendEmail = async (
  to: string,
  subject: string,
  template: React.ReactNode,
) => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("[Resend] RESEND_API_KEY is missing");
  }

  const normalizedTo = to.trim().toLowerCase();
  if (!normalizedTo) {
    throw new Error("[Resend] Recipient email is empty");
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: [normalizedTo],
    subject,
    react: template,
  });

  if (error) {
    throw new Error(`[Resend] ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("[Resend] Message accepted without id");
  }

  return data;
};
