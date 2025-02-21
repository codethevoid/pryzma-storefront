"use client";

import { ExtendedStoreCart, useCart } from "@/components/context/cart";
import { Text, RadioGroup, clx, Button, Select, toast } from "@medusajs/ui";
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

type BillingAddressFormData = z.infer<typeof schema>;

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
                  <form onSubmit={handleSubmit(onSubmit)} id="billing-address-form">
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
                        <FloatingLabelInput
                          label="Address"
                          {...register("address_1")}
                          isRequired
                          aria-invalid={!!errors.address_1}
                          formValue={watch("address_1")}
                        />
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
                              "pointer-events-none absolute left-3 top-3 text-ui-fg-muted transition-all group-data-[empty=false]:top-0.5 group-data-[empty=false]:text-[10px] group-data-[empty=false]:text-subtle-foreground"
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
                              "pointer-events-none absolute left-3 top-0.5 text-[10px] text-subtle-foreground transition-all"
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
      <Button isLoading={isSubmitting} disabled={!cart} form="billing-address-form" type="submit">
        Place order{" "}
        {cart?.payment_collection?.payment_sessions?.[0]?.data?.client_secret
          ? `and pay ${formatCurrency("usd", cart.payment_collection.payment_sessions[0].amount)}`
          : ""}
      </Button>
    </div>
  );
};
