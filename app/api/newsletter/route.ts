import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/db/prisma";
import { sendEmail } from "@/utils/send-email";
import { NewsletterSignupEmail } from "@/emails/newsletter-signup";

const schema = z.object({
  email: z.string().email(),
});

type NewsletterBody = {
  email: string;
};

export const POST = async (req: NextRequest) => {
  try {
    const body: NewsletterBody = await req.json();
    const { email } = body;

    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Here you would typically add the email to your newsletter service
    // But we are just going to insert it into our newsletter table
    // and will worry about it when the time comes
    if (await prisma.newsletter.findUnique({ where: { email: email.toLowerCase().trim() } })) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 });
    }

    await prisma.newsletter.create({ data: { email: email.toLowerCase().trim() } });

    // send email with coupon code
    after(async () => {
      await sendEmail({
        from: "Pryzma <notifs@mailer.pryzma.io>",
        to: email,
        replyTo: "support@pryzma.io",
        subject: "Here is your coupon code!",
        text: `Thank you for signing up to our newsletter! Here is your coupon code: WELCOME20`,
        react: NewsletterSignupEmail({ email, coupon: "WELCOME20" }),
      });

      await sendEmail({
        from: "Pryzma <notifs@mailer.pryzma.io>",
        to: process.env.NOTIFICATION_RECEIVING_EMAIL!,
        subject: "Newsletter Signup",
        text: `New newsletter signup: ${email}`,
      });
    });

    return NextResponse.json({ message: "Successfully signed up to newsletter" }, { status: 201 });
  } catch (e) {
    console.error(`Error signing up to newsletter: ${e}`);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
