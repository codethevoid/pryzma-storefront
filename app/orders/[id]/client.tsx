"use client";

import { useEffect, useState } from "react";
import { StoreOrder } from "@medusajs/types";
import { Text } from "@medusajs/ui";
import { formatCurrency } from "@/utils/format-currency";
import { OrderSummary } from "./summary";
import { ProgressAccordion } from "@medusajs/ui";
import { IconBadge } from "@medusajs/ui";
import { TruckFast, XCircle, Loader, ExclamationCircle } from "@medusajs/icons";
import type { Card } from "@stripe/stripe-js";
import NextLink from "next/link";
import { Button } from "@medusajs/ui";

const statusMap = {
  not_fulfilled: "confirmed",
  shipped: "on-the-way",
  delivered: "delivered",
  canceled: "canceled",
};

const getOrder = async (id: string) => {
  try {
    const response = await fetch(`/api/orders/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data as { order: StoreOrder; tracking: string | null; paymentMethod: Card | null };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const OrderClient = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [tracking, setTracking] = useState<string | null>(null);
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    getOrder(id).then((data) => {
      if (data) {
        setOrder(data.order);
        setTracking(data.tracking);
        setCard(data.paymentMethod);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-330.5px)] min-h-[250px] items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[calc(100vh-330.5px)] min-h-[250px] items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <IconBadge size="large" className="mx-auto">
            <ExclamationCircle />
          </IconBadge>
          <Text size="small" className="text-center">
            No order found
          </Text>
          <Button asChild size="small">
            <NextLink href="/">Go to home page</NextLink>
          </Button>
        </div>
      </div>
    );
  }

  const isBillingSameAsShipping = () => {
    return (
      order.billing_address?.first_name === order.shipping_address?.first_name &&
      order.billing_address?.last_name === order.shipping_address?.last_name &&
      order.billing_address?.address_1 === order.shipping_address?.address_1 &&
      order.billing_address?.address_2 === order.shipping_address?.address_2 &&
      order.billing_address?.city === order.shipping_address?.city &&
      order.billing_address?.province === order.shipping_address?.province &&
      order.billing_address?.postal_code === order.shipping_address?.postal_code &&
      order.billing_address?.country_code === order.shipping_address?.country_code
    );
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="grid grid-cols-3 max-lg:grid-cols-[1fr_1fr_340px] max-md:flex max-md:flex-col-reverse md:min-h-[calc(100vh-330.5px)]">
        <div className="col-span-2 space-y-5 p-8 pl-0 max-md:p-4 max-md:pb-12 max-md:pl-4">
          <div className="space-y-0.5">
            <Text className="uppercase text-subtle-foreground" size="xsmall">
              Order #{order.display_id}
            </Text>
            <Text weight="plus" size="large">
              Thank you for ordering, {order.billing_address?.first_name}!
              <span className="ml-2">🎉</span>
            </Text>
          </div>
          <div className="space-y-4">
            {order.status !== "canceled" ? (
              <div className="w-full rounded-md bg-zinc-50 shadow-borders-base dark:bg-zinc-900/50">
                <ProgressAccordion
                  type="single"
                  value={statusMap[order.fulfillment_status as keyof typeof statusMap]}
                >
                  <ProgressAccordion.Item
                    value="confirmed"
                    disabled={order.fulfillment_status !== "not_fulfilled"}
                  >
                    <ProgressAccordion.Header status="completed" className="pl-1 pr-3">
                      Order confirmed
                    </ProgressAccordion.Header>
                    <ProgressAccordion.Content className="pl-[70px]">
                      <div className="pb-6">
                        <Text size="small" className="text-subtle-foreground">
                          We&apos;re getting your order ready to be shipped. We will notify you when
                          it&apos;s on the way. If you need to make any changes, please contact us
                          as soon as possible. You can contact us about your order at{" "}
                          <a
                            href="mailto:support@pryzma.io"
                            className="text-blue-500 hover:underline dark:text-blue-400"
                          >
                            support@pryzma.io
                          </a>
                          .
                        </Text>
                      </div>
                    </ProgressAccordion.Content>
                  </ProgressAccordion.Item>
                  <ProgressAccordion.Item
                    value="on-the-way"
                    disabled={order.fulfillment_status !== "shipped"}
                  >
                    <ProgressAccordion.Header
                      className="pl-1 pr-3"
                      status={
                        order.fulfillment_status === "delivered" ? "completed" : "not-started"
                      }
                    >
                      On the way
                    </ProgressAccordion.Header>
                    <ProgressAccordion.Content className="pl-[70px]">
                      <div className="pb-6">
                        <Text size="small" className="text-subtle-foreground">
                          Your order is on the way! You can expect it to arrive within 1-5 business
                          days depending on your location and shipping method. You can track your
                          order through the tracking number/link provided below.
                        </Text>
                      </div>
                    </ProgressAccordion.Content>
                  </ProgressAccordion.Item>
                  <ProgressAccordion.Item
                    value="delivered"
                    disabled={order.fulfillment_status !== "delivered"}
                  >
                    <ProgressAccordion.Header
                      className="pl-1 pr-3"
                      status={
                        order.fulfillment_status === "delivered" ? "completed" : "not-started"
                      }
                    >
                      Package delivered
                    </ProgressAccordion.Header>
                    <ProgressAccordion.Content className="pl-[70px]">
                      <div className="pb-6">
                        <Text size="small" className="text-subtle-foreground">
                          Your order has been delivered! We hope you enjoy your purchase. If you
                          have not received your package, or have any questions, please contact us
                          at{" "}
                          <a
                            href="mailto:support@pryzma.io"
                            className="text-blue-500 hover:underline dark:text-blue-400"
                          >
                            support@pryzma.io
                          </a>
                          .
                        </Text>
                      </div>
                    </ProgressAccordion.Content>
                  </ProgressAccordion.Item>
                </ProgressAccordion>
              </div>
            ) : (
              <div className="w-full space-y-1 rounded-md bg-zinc-50 px-4 py-3 shadow-borders-base dark:bg-zinc-900/50">
                <div className="flex items-center gap-[18px]">
                  <IconBadge color="red" className="h-[34px] w-[34px]">
                    <XCircle />
                  </IconBadge>
                  <div>
                    <Text size="small" weight="plus">
                      Order canceled
                    </Text>
                    <Text size="xsmall" className="text-subtle-foreground">
                      This order has been canceled.
                    </Text>
                  </div>
                </div>
              </div>
            )}
            {order.status !== "canceled" && (
              <div className="w-full space-y-1 rounded-md bg-zinc-50 px-4 py-3 shadow-borders-base dark:bg-zinc-900/50">
                <div className="flex items-center gap-[18px]">
                  <IconBadge className="h-[34px] w-[34px]">
                    <TruckFast />
                  </IconBadge>
                  <div>
                    <Text size="small" weight="plus">
                      USPS tracking
                    </Text>
                    <div>
                      {tracking ? (
                        <a
                          href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Text
                            size="xsmall"
                            className="text-blue-500 hover:underline dark:text-blue-400"
                          >
                            {tracking}
                          </Text>
                        </a>
                      ) : (
                        <Text size="xsmall" className="text-subtle-foreground">
                          No tracking available yet
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full rounded-md bg-zinc-50 shadow-borders-base dark:bg-zinc-900/50">
              {/* <div className="border-b px-4 py-3">
                <Text weight="plus">Order details</Text>
              </div> */}
              <div className="grid grid-cols-2 border-b p-4 max-[900px]:grid-cols-1 max-[900px]:gap-2">
                <Text weight="plus" size="small">
                  Contact
                </Text>
                <div className="space-y-0.5">
                  <Text size="small" className="text-subtle-foreground">
                    {order.email}
                  </Text>
                  <Text size="small" className="text-subtle-foreground">
                    {order.shipping_address?.phone}
                  </Text>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b p-4 max-[900px]:grid-cols-1 max-[900px]:gap-2">
                <Text weight="plus" size="small">
                  Shipping address
                </Text>
                <div className="space-y-0.5">
                  <Text size="small" className="text-subtle-foreground">
                    {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                  </Text>
                  <Text size="small" className="text-subtle-foreground">
                    {order.shipping_address?.address_1}
                  </Text>
                  {order.shipping_address?.address_2 && (
                    <Text size="small" className="text-subtle-foreground">
                      {order.shipping_address?.address_2}
                    </Text>
                  )}
                  <Text size="small" className="text-subtle-foreground">
                    {order.shipping_address?.city}, {order.shipping_address?.province}{" "}
                    {order.shipping_address?.postal_code}
                  </Text>
                  <Text size="small" className="text-subtle-foreground">
                    United States
                  </Text>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b p-4 max-[900px]:grid-cols-1 max-[900px]:gap-2">
                <Text weight="plus" size="small">
                  Billing address
                </Text>
                <div className="space-y-0.5">
                  {isBillingSameAsShipping() ? (
                    <Text size="small" className="text-subtle-foreground">
                      Same as shipping address
                    </Text>
                  ) : (
                    <>
                      <Text size="small" className="text-subtle-foreground">
                        {order.billing_address?.first_name} {order.billing_address?.last_name}
                      </Text>
                      <Text size="small" className="text-subtle-foreground">
                        {order.billing_address?.address_1}
                      </Text>
                      {order.billing_address?.address_2 && (
                        <Text size="small" className="text-subtle-foreground">
                          {order.billing_address?.address_2}
                        </Text>
                      )}
                      <Text size="small" className="text-subtle-foreground">
                        {order.billing_address?.city}, {order.billing_address?.province}{" "}
                        {order.billing_address?.postal_code}
                      </Text>
                      <Text size="small" className="text-subtle-foreground">
                        United States
                      </Text>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b p-4 max-[900px]:grid-cols-1 max-[900px]:gap-2">
                <Text weight="plus" size="small">
                  Shipping method
                </Text>
                <Text size="small" className="text-subtle-foreground">
                  {order.shipping_methods?.[0]?.name}
                </Text>
              </div>
              {card && (
                <div className="grid grid-cols-2 p-4 max-[900px]:grid-cols-1 max-[900px]:gap-2">
                  <Text weight="plus" size="small">
                    Payment method
                  </Text>
                  <Text size="small" className="text-subtle-foreground">
                    {card?.brand.toUpperCase()} ending in {card?.last4} -{" "}
                    <span className="text-foreground">{formatCurrency("usd", order.total)}</span>
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
        <OrderSummary order={order} />
      </div>
    </div>
  );
};
