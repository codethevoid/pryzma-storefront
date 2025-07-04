"use client";

import { IconBadge, Text } from "@medusajs/ui";
import { Loader } from "@medusajs/icons";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/context/cart";

const processOrder = async (token: string) => {
  const response = await fetch("/api/checkout/process", {
    method: "POST",
    body: JSON.stringify({ token }),
  });

  if (!response.ok) return null;
  return (await response.json()) as { order: { id: string } };
};

export const ProcessOrderClient = ({ token }: { token: string }) => {
  const router = useRouter();
  const { refreshCart } = useCart();

  useEffect(() => {
    processOrder(token)
      .then((data) => {
        if (!data) {
          router.push("/checkout");
          return;
        }

        router.push(`/orders/${data.order.id}`);
        refreshCart();
      })
      .catch(() => router.push("/checkout"));
  }, []);

  return (
    <div className="flex flex-col items-center space-y-3">
      <IconBadge size="large" className="mx-auto" color="blue">
        <Loader className="animate-spin" />
      </IconBadge>
      <Text size="large" className="text-center" weight="plus">
        We are processing your order.
      </Text>
      <Text size="small" className="text-center">
        Please wait while we process your order.
        <br /> You will be redirected shortly.
      </Text>
    </div>
  );
};
