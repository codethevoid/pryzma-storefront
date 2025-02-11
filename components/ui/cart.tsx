"use client";

import { Drawer, Text, Button, clx, IconButton, Input, IconBadge } from "@medusajs/ui";
import { useCart } from "../context/cart";
import { ShoppingBag, Spinner, Trash } from "@medusajs/icons";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useState } from "react";

export const Cart = () => {
  const { cart, isOpen, setIsOpen, updateItem, removeItem } = useCart();
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number | string>>({});

  useEffect(() => {
    if (cart?.items) {
      const initialQuantities = cart.items.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: item.quantity,
        }),
        {},
      );
      setQuantities(initialQuantities);
    }
  }, [cart, isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Your cart</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="overflow-y-auto">
          {(cart?.items?.length || 0) > 0 ? (
            <div className="space-y-4">
              {cart?.items?.map((item, index) => (
                <div
                  key={item.id}
                  className={clx("flex gap-4 border-dashed", index !== 0 && "border-t pt-4")}
                >
                  <div className="h-28 w-24 shrink-0 overflow-hidden rounded-md border">
                    <NextLink
                      href={`/products/${item.product_handle}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Image
                        src={item.thumbnail as string}
                        alt={item.product_title as string}
                        width={1000}
                        height={1000}
                        className="h-full w-full object-cover"
                      />
                    </NextLink>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="space-y-0.5">
                      <NextLink
                        href={`/products/${item.product_handle}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Text weight="plus">{item.product_title}</Text>
                      </NextLink>

                      <Text size="small" className="text-subtle-foreground">
                        {formatCurrency("usd", item.unit_price)}
                      </Text>

                      {(item.product?.variants?.length || 1) > 1 && (
                        <div className="space-y-0.5">
                          {item.product?.options?.map((option) => (
                            <Text key={option.id} size="small" weight="plus">
                              {option.title}:{" "}
                              <Text as="span" size="small" className="text-subtle-foreground">
                                {
                                  item.variant?.options?.find((o) => o.option_id === option.id)
                                    ?.value
                                }
                              </Text>
                            </Text>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        size="small"
                        type="number"
                        className="w-28"
                        value={quantities[item.id]}
                        disabled={isUpdating[item.id]}
                        onBlur={async (e) => {
                          const quantity = parseInt(e.target.value);
                          if (quantity === item.quantity) return;
                          if (quantity === 0 || !quantity || isNaN(quantity)) {
                            setIsUpdating({ ...isUpdating, [item.id]: true });
                            removeItem(item.id);
                            setIsUpdating({ ...isUpdating, [item.id]: false });
                          } else {
                            setIsUpdating({ ...isUpdating, [item.id]: true });
                            await updateItem({ itemId: item.id, quantity });
                            setIsUpdating({ ...isUpdating, [item.id]: false });
                          }
                        }}
                        onChange={async (e) => {
                          const quantity = e.target.value === "" ? "" : parseInt(e.target.value);
                          setQuantities({ ...quantities, [item.id]: quantity });
                          if (quantity === "") return;

                          if (
                            Math.abs(
                              quantity - ((quantities[item.id] as number) || item.quantity),
                            ) === 1
                          ) {
                            if (quantity === 0) {
                              setIsUpdating({ ...isUpdating, [item.id]: true });
                              await removeItem(item.id);
                              setIsUpdating({ ...isUpdating, [item.id]: false });
                            } else {
                              setIsUpdating({ ...isUpdating, [item.id]: true });
                              await updateItem({ itemId: item.id, quantity });
                              setIsUpdating({ ...isUpdating, [item.id]: false });
                            }
                          }
                        }}
                      />
                      <IconButton
                        variant="transparent"
                        size="small"
                        onClick={async () => {
                          setIsRemoving({ ...isRemoving, [item.id]: true });
                          await removeItem(item.id);
                          setIsRemoving({ ...isRemoving, [item.id]: false });
                        }}
                        disabled={isRemoving[item.id]}
                      >
                        {isRemoving[item.id] ? <Spinner className="animate-spin" /> : <Trash />}
                      </IconButton>
                    </div>
                  </div>
                  <Text weight="plus">
                    {formatCurrency("usd", item.unit_price * item.quantity)}
                  </Text>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] w-full items-center justify-center">
              <div className="space-y-3">
                <IconBadge size="large" className="mx-auto">
                  <ShoppingBag />
                </IconBadge>
                <Text size="small" className="text-center">
                  Your cart is empty
                </Text>
                <Button asChild size="small" onClick={() => setIsOpen(false)}>
                  <NextLink href="/products">Start shopping</NextLink>
                </Button>
              </div>
            </div>
          )}
        </Drawer.Body>
        {cart?.items?.length && (
          <Drawer.Footer>
            <div className="w-full space-y-3">
              <Text className="text-center text-subtle-foreground" size="small">
                Shipping and taxes calculated at checkout.
              </Text>
              <Button className="w-full" size="large" asChild onClick={() => setIsOpen(false)}>
                <NextLink href="/checkout">
                  <ShoppingBag /> Checkout - {formatCurrency("usd", cart?.item_subtotal || 0)}
                </NextLink>
              </Button>
            </div>
          </Drawer.Footer>
        )}
      </Drawer.Content>
    </Drawer>
  );
};
