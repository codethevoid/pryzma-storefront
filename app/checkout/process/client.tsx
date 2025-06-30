"use client";

import { IconBadge, Text } from "@medusajs/ui";
import { Check, Loader } from "@medusajs/icons";
import { medusa } from "@/utils/medusa";
import { StoreCart } from "@medusajs/types";
import { useEffect } from "react";

const processOrder = async (token: string) => {};

export const ProcessOrderClient = ({ token }: { token: string }) => {
  useEffect(() => {
    processOrder(token).then(() => {});
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
