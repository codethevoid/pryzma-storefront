"use client";

import { Drawer, Text, Button, clx, IconButton, Input, IconBadge } from "@medusajs/ui";
import { useCart } from "../context/cart";
import { Minus, Plus, ShoppingBag, Spinner, Trash } from "@medusajs/icons";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cdnUrl, s3Url } from "@/utils/s3";
import { medusa } from "@/utils/medusa";
import type { ExtendedStoreCart } from "../context/cart";
import { useDebounceCallback } from "@/hooks/utils/use-debounce-callback";

export const Cart = () => {
  const { cart, setCart, isOpen, setIsOpen, updateItem, removeItem, fields } = useCart();
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number | string>>({});

  const debouncedUpdateItem = useDebounceCallback(async (itemId: string, newQuantity: number) => {
    setIsUpdating((prev) => ({ ...prev, [itemId]: true }));

    if (newQuantity === 0) {
      await removeItem(itemId);
    } else {
      const response = await updateItem({ itemId, quantity: newQuantity });
      if (response?.error) {
        // revert back to previous quantity
        // must fetch new cart to get the correct quantity
        // this will trigger a re-render of the cart and useEffect will update the quantities
        medusa.store.cart.retrieve(cart?.id as string, { fields }).then(({ cart }) => {
          setCart(cart as ExtendedStoreCart);
        });
      }
    }

    setIsUpdating((prev) => ({ ...prev, [itemId]: false }));
  }, 500);

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
      <Drawer.Content className="z-[9999]" aria-describedby={undefined}>
        <Drawer.Header>
          <VisuallyHidden>
            <Drawer.Title>Your cart</Drawer.Title>
          </VisuallyHidden>
          <IconBadge className="relative top-[2px]">
            <ShoppingBag />
          </IconBadge>
        </Drawer.Header>
        <Drawer.Body className="overflow-y-auto">
          {(cart?.items?.length || 0) > 0 ? (
            <div className="space-y-4">
              {cart?.items?.map((item, index) => (
                <div key={item.id} className={clx("flex gap-4", index !== 0 && "border-t pt-4")}>
                  <div className="h-28 w-24 shrink-0 overflow-hidden rounded-md border">
                    <NextLink
                      href={`/products/${item.product?.collection?.handle}/${item.product_handle}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Image
                        src={item.thumbnail?.replace(s3Url, cdnUrl) as string}
                        alt={item.product_title as string}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    </NextLink>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="space-y-0.5">
                      <NextLink
                        href={`/products/${item.product?.collection?.handle}/${item.product_handle}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Text weight="plus" size="small">
                          {item.product_title}
                        </Text>
                      </NextLink>

                      <Text size="small" className="text-subtle-foreground">
                        {formatCurrency("usd", item.unit_price)}
                      </Text>
                      {item.product?.variants?.length && (
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
                      <div className="flex items-center rounded-md shadow-borders-base">
                        <IconButton
                          disabled={isUpdating[item.id] || quantities[item.id] === 0}
                          size="small"
                          className="rounded-r-none bg-ui-bg-field !shadow-none"
                          onClick={async () => {
                            const quantity = quantities[item.id] as number;
                            if (quantity === 1) {
                              setQuantities({ ...quantities, [item.id]: 0 });
                              debouncedUpdateItem(item.id, 0);
                            } else {
                              setQuantities({
                                ...quantities,
                                [item.id]: quantity - 1,
                              });
                              debouncedUpdateItem(item.id, quantity - 1);
                            }
                          }}
                        >
                          <Minus />
                        </IconButton>
                        <Input
                          size="small"
                          type="number"
                          className="w-10 rounded-none text-center shadow-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          value={quantities[item.id]}
                          disabled={isUpdating[item.id]}
                          onBlur={async (e) => {
                            const quantity = parseInt(e.target.value);
                            if (quantity === item.quantity) return;
                            if (
                              quantity === 0 ||
                              !quantity ||
                              isNaN(quantity) ||
                              quantity.toString().includes(".") ||
                              quantity.toString().includes("-")
                            ) {
                              debouncedUpdateItem(item.id, 0);
                            } else {
                              debouncedUpdateItem(item.id, quantity);
                            }
                          }}
                          onChange={async (e) => {
                            const quantity = e.target.value === "" ? "" : parseInt(e.target.value);
                            setQuantities({ ...quantities, [item.id]: quantity });
                          }}
                        />
                        <IconButton
                          disabled={isUpdating[item.id]}
                          size="small"
                          className="rounded-l-none bg-ui-bg-field !shadow-none"
                          onClick={async () => {
                            const quantity = quantities[item.id] as number;
                            setQuantities({ ...quantities, [item.id]: quantity + 1 });
                            await debouncedUpdateItem(item.id, quantity + 1);
                          }}
                        >
                          <Plus />
                        </IconButton>
                      </div>
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
                  <Text weight="plus" size="small">
                    {formatCurrency("usd", item.unit_price * item.quantity)}
                  </Text>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] w-full items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
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
        {(cart?.items?.length || 0 > 0) && (
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
