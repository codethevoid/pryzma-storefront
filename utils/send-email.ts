import { Resend } from "resend";
import { ReactNode } from "react";

type SendEmailProps = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  react?: ReactNode;
  text: string;
  scheduledAt?: string | undefined;
};

export const sendEmail = async ({
  from,
  to,
  replyTo,
  subject,
  react,
  text,
  scheduledAt,
}: SendEmailProps) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return await resend.emails.send({
    from,
    to,
    replyTo,
    subject,
    react,
    text,
    scheduledAt: scheduledAt,
  });
};
