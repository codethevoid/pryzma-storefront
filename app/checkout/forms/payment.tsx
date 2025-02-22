"use client";

import { ExtendedStoreCart, useCart } from "@/components/context/cart";
import { Text, RadioGroup, clx, Button, Select, toast, Popover } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { medusa } from "@/utils/medusa";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { formatCurrency } from "@/utils/format-currency";
import type { StoreCart } from "@medusajs/types";
import { z } from "zod";
import { FloatingLabelInput } from "@/components/ui/custom/floating-label-input";
import { useForm } from "react-hook-form";
import { usStates } from "@/lib/states";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { setAddressValues } from "@/lib/helpers/set-address-values";
import { useAddressAutocomplete } from "@/hooks/use-address-auto-complete";
import { Google } from "@/lib/icons/google";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);
const StripePayment = () => {
  const { cart, isLoadingClientSecret } = useCart();
  const clientSecret = cart?.payment_collection?.payment_sessions?.[0]?.data
    ?.client_secret as string;

  if (!clientSecret || isLoadingClientSecret) {
    return <div className="h-8 w-full animate-pulse rounded-md bg-zinc-500/15" />;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm />
    </Elements>
  );
};

const StripePaymentForm = () => {
  const { initializeStripe } = useCart();
  const elements = useElements();
  const stripe = useStripe();
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (stripe && elements) {
      initializeStripe(stripe, elements);
    }
  }, [initializeStripe, elements, stripe]);

  return (
    <CardElement
      options={{
        hidePostalCode: true,
        style: {
          base: {
            color: resolvedTheme === "dark" ? "rgba(244, 244, 245, 1)" : "rgba(24, 24, 27, 1)",
            iconColor: resolvedTheme === "dark" ? "#fff" : "#000",
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
            fontSize: "13px",
            fontWeight: "400",
            fontSmoothing: "antialiased",
            "::placeholder": {
              color: "rgba(113, 113, 122, 1)",
              fontSize: "13px",
              fontWeight: "400",
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
            },
          },
        },
        classes: {
          invalid: "shadow-borders-error",
          focus: "shadow-borders-interactive-with-active",
          base: `caret-ui-fg-base cursor-text bg-ui-bg-field hover:bg-ui-bg-field-hover shadow-borders-base text-ui-fg-base transition-fg relative appearance-none rounded-md outline-none txt-compact-small h-8 px-2 h-8 py-[7px] w-full`,
        },
      }}
    />
  );
};

const schema = z.object({
  province: z.string().min(1, { message: "State is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  address_1: z.string().min(1, { message: "Address is required" }),
  address_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  postal_code: z.string().min(1, { message: "Postal code is required" }),
  country_code: z.string().min(1, { message: "Country is required" }),
});

export type BillingAddressFormData = z.infer<typeof schema>;

export const PaymentForm = () => {
  const { cart, setCart, fields, setIsLoadingClientSecret, stripe, elements, refreshCart } =
    useCart();
  const [paymentMethod, setPaymentMethod] = useState<string | null>();
  const [billingSameAsShipping, setBillingSameAsShipping] = useState<"same" | "different">("same");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<BillingAddressFormData>({ defaultValues: { country_code: "us", province: "" } });

  // address autocomplete
  const {
    setValue: setAddressValue,
    suggestions,
    handleSelect: handleAddressSelect,
    ready,
  } = useAddressAutocomplete();
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);

  const onSubmit = async (data: BillingAddressFormData) => {
    if (!cart || !cart.shipping_address || !stripe || !elements) return;
    setIsSubmitting(true);

    try {
      // 1. Update the cart with the billing address
      if (billingSameAsShipping === "same") {
        // use shipping address as billing address
        await medusa.store.cart.update(cart.id, {
          billing_address: {
            ...(cart.shipping_address.phone && { phone: cart.shipping_address.phone }),
            ...(cart.shipping_address.address_2 && { address_2: cart.shipping_address.address_2 }),
            first_name: cart.shipping_address.first_name,
            last_name: cart.shipping_address.last_name,
            address_1: cart.shipping_address.address_1,
            city: cart.shipping_address.city,
            province: cart.shipping_address.province,
            postal_code: cart.shipping_address.postal_code,
            country_code: cart.shipping_address.country_code,
          },
        });
      } else {
        // parse form data and add new billing address to cart
        const result = schema.safeParse(data);
        if (!result.success) {
          result.error.errors.forEach((error) => {
            setError(error.path[0] as keyof BillingAddressFormData, {
              type: "manual",
              message: error.message,
            });
          });
          return;
        }

        await medusa.store.cart.update(cart.id, {
          billing_address: {
            ...(cart.shipping_address.phone && { phone: cart.shipping_address.phone }),
            ...(data.address_2 && { address_2: data.address_2 }),
            first_name: data.first_name,
            last_name: data.last_name,
            address_1: data.address_1,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            country_code: data.country_code,
          },
        });
      }

      // 2.Complete the payment
      const card = elements.getElement("card");
      const clientSecret = cart?.payment_collection?.payment_sessions?.[0]?.data
        ?.client_secret as string;

      if (!card || !clientSecret) return;

      const response = await medusa.store.cart.retrieve(cart.id, { fields });
      const updatedCart = response.cart as ExtendedStoreCart;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: `${updatedCart.billing_address?.first_name} ${updatedCart.billing_address?.last_name}`,
            email: updatedCart.email,
            phone: updatedCart.billing_address?.phone,
            address: {
              city: updatedCart.billing_address?.city,
              country: updatedCart.billing_address?.country_code,
              line1: updatedCart.billing_address?.address_1,
              line2: updatedCart.billing_address?.address_2,
              postal_code: updatedCart.billing_address?.postal_code,
              state: updatedCart.billing_address?.province,
            },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to place order");
        console.error(result.error);
        return;
      }

      // 3. Complete the order in Medusa
      const completed = await medusa.store.cart.complete(cart.id);
      if (completed.type === "order" && completed.order) {
        const { order } = completed;
        console.log(order);
        // redirect to order confirmation page
        router.push(`/orders/${order.id}`);
        refreshCart();
      } else if (completed.type === "cart" && completed.cart) {
        console.error(completed.error);
        toast.error(completed.error.message || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const address1 = watch("address_1");
  useEffect(() => {
    if (!ready) return;
    setAddressValue(address1);
    setSelectedAddressIndex(-1);
  }, [address1, ready]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Text weight="plus">Payment information</Text>
        <RadioGroup
          value={paymentMethod || ""}
          onValueChange={async (value) => {
            if (!cart) return;
            setPaymentMethod(value);
            setIsLoadingClientSecret(true);
            // need to update the cart with payment provider
            await medusa.store.payment.initiatePaymentSession(cart as StoreCart, {
              provider_id: "pp_stripe_stripe",
            });

            // get updated cart
            const response = await medusa.store.cart.retrieve(cart?.id as string, { fields });
            setCart(response.cart as ExtendedStoreCart);
            setIsLoadingClientSecret(false);
          }}
        >
          <div>
            <RadioGroup.ChoiceBox
              label="Credit card"
              description="Payments are secure and encrypted."
              value="credit_card"
              className={clx(
                "z-5 relative w-full bg-zinc-50 dark:bg-zinc-900/50",
                paymentMethod && "rounded-b-none",
              )}
            />
            <div
              className={clx(
                "grid transition-[grid-template-rows]",
                paymentMethod ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                className={clx(
                  "overflow-hidden rounded-b-lg dark:bg-zinc-900/50",
                  paymentMethod && "shadow-borders-base",
                )}
              >
                <div className={clx("max-w-md space-y-2 p-4")}>
                  <Text size="small">Please enter your card details</Text>
                  <div className="h-8">
                    <StripePayment />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <div>
          <Text weight="plus">Billing address</Text>
          <Text size="small" className="text-subtle-foreground">
            Select the address that matches your card.
          </Text>
        </div>
        <RadioGroup
          value={billingSameAsShipping}
          onValueChange={(value: "same" | "different") => {
            setBillingSameAsShipping(value);
            clearErrors();
          }}
        >
          <RadioGroup.ChoiceBox
            label="Same as shipping address"
            value="same"
            description=""
            className="bg-zinc-50 dark:bg-zinc-900/50"
          />
          <div>
            <RadioGroup.ChoiceBox
              label="Use a different billing address"
              description=""
              value="different"
              className={clx(
                "z-5 relative w-full bg-zinc-50 dark:bg-zinc-900/50",
                billingSameAsShipping === "different" && "rounded-b-none",
              )}
            />
            <div
              className={clx(
                "grid transition-[grid-template-rows]",
                billingSameAsShipping === "different" ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                className={clx(
                  "overflow-hidden rounded-b-lg dark:bg-zinc-900/50",
                  billingSameAsShipping === "different" && "shadow-borders-base",
                )}
              >
                <div className={clx("p-4")}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    id="billing-address-form"
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="space-y-2">
                      <Text weight="plus">Billing address</Text>
                      <div className="grid grid-cols-2 grid-rows-3 gap-3 max-[900px]:grid-cols-1">
                        <FloatingLabelInput
                          label="First name"
                          {...register("first_name")}
                          isRequired
                          aria-invalid={!!errors.first_name}
                          formValue={watch("first_name")}
                        />
                        <FloatingLabelInput
                          label="Last name"
                          {...register("last_name")}
                          isRequired
                          aria-invalid={!!errors.last_name}
                          formValue={watch("last_name")}
                        />
                        <Popover open={isSuggestionsOpen} modal={false}>
                          <Popover.Trigger asChild>
                            <div>
                              <FloatingLabelInput
                                id="address-input"
                                label="Address"
                                isRequired
                                formValue={watch("address_1")}
                                aria-invalid={!!errors.address_1}
                                {...register("address_1")}
                                onFocus={() => setIsSuggestionsOpen(true)}
                                onBlur={() => setIsSuggestionsOpen(false)}
                                onKeyDown={async (e) => {
                                  if (!suggestions.data.length) return;

                                  switch (e.key) {
                                    case "ArrowDown":
                                      e.preventDefault();
                                      setSelectedAddressIndex(
                                        (prev) => (prev + 1) % suggestions.data.length,
                                      );
                                      break;
                                    case "ArrowUp":
                                      e.preventDefault();
                                      setSelectedAddressIndex(
                                        (prev) =>
                                          (prev - 1 + suggestions.data.length) %
                                          suggestions.data.length,
                                      );
                                      break;
                                    case "Enter":
                                      e.preventDefault();
                                      if (selectedAddressIndex > -1) {
                                        const place = await handleAddressSelect(
                                          suggestions.data[selectedAddressIndex].description,
                                        );
                                        setAddressValues({ place, setValue });
                                        setSelectedAddressIndex(-1);
                                        setIsSuggestionsOpen(false);
                                      }
                                  }
                                }}
                              />
                            </div>
                          </Popover.Trigger>
                          <Popover.Content
                            avoidCollisions={false}
                            collisionPadding={16}
                            className={clx(
                              "w-[var(--radix-popover-trigger-width)] bg-ui-bg-component",
                              (suggestions.status !== "OK" || !suggestions.data.length) && "hidden",
                            )}
                            onOpenAutoFocus={(e) => e.preventDefault()}
                          >
                            {suggestions.data.map((suggestion, index) => (
                              <div
                                role="button"
                                key={suggestion.place_id}
                                className={clx(
                                  "flex gap-2 rounded-md px-2 py-1.5 hover:bg-ui-bg-component-hover dark:hover:bg-[#ffffff0a]",
                                  index === selectedAddressIndex &&
                                    "bg-ui-bg-component-hover dark:bg-[#ffffff0a]",
                                )}
                                onClick={async () => {
                                  const place = await handleAddressSelect(suggestion.description);
                                  setAddressValues({ place, setValue });
                                  setSelectedAddressIndex(-1);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="relative top-[3px] size-3 text-subtle-foreground"
                                >
                                  <path d="M12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995L16.9497 15.9497ZM12 13C10.8954 13 10 12.1046 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11C14 12.1046 13.1046 13 12 13Z"></path>
                                </svg>
                                <Text size="small">
                                  {`${suggestion.description.split(",")[0]} `}
                                  <Text as="span" size="xsmall" className="text-subtle-foreground">
                                    {`${suggestion.description.split(",")[1]}, `}
                                    {`${suggestion.description.split(",")[2]}, `}
                                    {`${suggestion.description.split(",")[3]}`}
                                    {/* we can hide this since all addresses will be in USA */}
                                  </Text>
                                </Text>
                              </div>
                            ))}
                            <div className="mt-1 flex items-center justify-end gap-0.5 border-t px-2 pb-0.5 pt-1.5">
                              <Text size="xsmall" className="text-subtle-foreground">
                                Suggestions powered by
                              </Text>
                              <div className="-mt-1 grayscale">
                                <Google />
                              </div>
                            </div>
                          </Popover.Content>
                        </Popover>
                        <FloatingLabelInput
                          label="Apartment, suite, etc."
                          {...register("address_2")}
                          formValue={watch("address_2")}
                        />
                        <FloatingLabelInput
                          label="City"
                          {...register("city")}
                          isRequired
                          aria-invalid={!!errors.city}
                          formValue={watch("city")}
                        />
                        <div className="group relative" data-empty={!watch("province")}>
                          <Select
                            value={watch("province")}
                            onValueChange={(value) => {
                              setValue("province", value, { shouldValidate: true });
                              clearErrors("province");
                            }}
                          >
                            <Select.Trigger
                              className={clx(
                                "h-[42px] px-3 pb-1 pt-4 [&>svg]:relative [&>svg]:top-[-5px]",
                                errors.province && "shadow-borders-error",
                              )}
                            >
                              <Select.Value />
                            </Select.Trigger>
                            <Select.Content className="z-20" collisionPadding={16}>
                              {usStates.map((state) => (
                                <Select.Item key={state.abbreviation} value={state.abbreviation}>
                                  {state.name}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
                          <Text
                            size="small"
                            className={
                              "pointer-events-none absolute left-3 top-3 origin-top-left text-ui-fg-muted transition-all group-data-[empty=false]:top-1 group-data-[empty=false]:scale-[0.77] group-data-[empty=false]:text-subtle-foreground"
                            }
                          >
                            State
                            <span className="relative -top-0.5 left-[1px] text-red-600 dark:text-red-400">
                              *
                            </span>
                          </Text>
                        </div>
                        <FloatingLabelInput
                          label="Postal code"
                          {...register("postal_code")}
                          isRequired
                          aria-invalid={!!errors.postal_code}
                          formValue={watch("postal_code")}
                        />
                        <div className="relative" aria-invalid={!!errors.country_code}>
                          <Select value="us">
                            <Select.Trigger className="h-[42px] px-3 pb-1 pt-4 [&>svg]:relative [&>svg]:top-[-5px]">
                              <Select.Value placeholder="Country" />
                            </Select.Trigger>
                            <Select.Content collisionPadding={16}>
                              <Select.Item value="us">United States</Select.Item>
                            </Select.Content>
                          </Select>
                          <Text
                            size="small"
                            className={
                              "pointer-events-none absolute left-3 top-1 origin-top-left scale-[0.77] text-subtle-foreground transition-all"
                            }
                          >
                            Country
                          </Text>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
      <Button
        isLoading={isSubmitting}
        disabled={!cart || paymentMethod !== "credit_card"}
        form="billing-address-form"
        type="submit"
      >
        Place order{" "}
        {cart?.payment_collection?.payment_sessions?.[0]?.data?.client_secret
          ? `and pay ${formatCurrency("usd", cart.payment_collection.payment_sessions[0].amount)}`
          : ""}
      </Button>
    </div>
  );
};
