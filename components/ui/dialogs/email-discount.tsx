"use client";

import { Button, Input, Prompt, toast } from "@medusajs/ui";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cdnUrl } from "@/utils/s3";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { confettiFireworks } from "@/components/magicui/confetti-fireworks";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

type FormData = z.infer<typeof schema>;

export const EmailDiscountDialog = () => {
  const path = usePathname();
  const [usedDiscount, setUsedDiscount] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmissionError(null);
    setIsSubmitting(true);
    const { email } = data;

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setSubmissionError(data.error || "Something went wrong. Please try again.");
        return;
      }

      localStorage.setItem("email-discount", "1");
      toast.success("Check your email for your discount code!");
      setUpdated(true);
      confettiFireworks();
    } catch (e) {
      console.error(e);
      setSubmissionError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const discountUsed = localStorage.getItem("email-discount");
    if (discountUsed) setUsedDiscount(true);
    setLoaded(true);
  }, [updated]);

  useEffect(() => {
    setSubmissionError(null);
  }, [watch("email")]);

  if (path === "/checkout" || !loaded || usedDiscount) {
    return null;
  }

  return (
    <Prompt>
      <Prompt.Trigger asChild>
        <Button className="fixed bottom-4 right-4 z-50 overflow-visible rounded-full bg-blue-700 shadow-none dark:shadow-[inset_0_1px_0_1px_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.4)]">
          20% Discount
        </Button>
      </Prompt.Trigger>
      <Prompt.Content className="z-[9999]">
        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-t-lg border-b bg-zinc-50 dark:bg-zinc-950">
          <FlickeringGrid
            className="absolute inset-0 hidden size-full dark:block"
            color="#fff"
            height={112}
            width={400}
            gridGap={2}
            squareSize={2}
          />

          <FlickeringGrid
            className="absolute inset-0 size-full dark:hidden"
            color="#000"
            height={112}
            width={400}
            gridGap={2}
            squareSize={2}
          />
          <div className="z-10 w-fit shrink-0 rounded-md border bg-zinc-100 p-0.5 shadow-sm dark:bg-zinc-800">
            <Image
              src={`${cdnUrl}/logos/pryzma.png`}
              alt="pryzma logo"
              width={500}
              height={500}
              quality={100}
              className="size-12 rounded"
            />
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div className="space-y-0.5">
            <Prompt.Title className="text-center">Get 20% off your first order!</Prompt.Title>
            <Prompt.Description className="text-center">
              Sign up to our newsletter and receive a 20% discount code for your first purchase.
            </Prompt.Description>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Input placeholder="Your email..." autoFocus {...register("email")} />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
              {submissionError && <p className="mt-1.5 text-xs text-red-500">{submissionError}</p>}
            </div>
            <Button className="w-full" isLoading={isSubmitting}>
              Send my code
            </Button>
          </form>
        </div>
        <Prompt.Cancel
          className="absolute right-2 top-2 size-6 bg-background p-0"
          onClick={() => {
            localStorage.setItem("email-discount", "1");
            setUpdated(true);
          }}
        >
          <XIcon className="size-4" />
        </Prompt.Cancel>
      </Prompt.Content>
    </Prompt>
  );
};
