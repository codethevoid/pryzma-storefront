"use client";

import { FloatingLabelInput } from "@/components/ui/custom/floating-label-input";
import { Text, Select, Button, clx, Popover } from "@medusajs/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/components/context/cart";
import { usStates } from "@/lib/states";
import { medusa } from "@/utils/medusa";
import { toast } from "@medusajs/ui";
import { useEffect, useState } from "react";
import type { ExtendedStoreCart } from "@/components/context/cart";
import { shippingOptions } from "@/lib/shipping-options";
import { useAddressAutocomplete } from "@/hooks/use-address-auto-complete";
import { setAddressValues } from "@/lib/helpers/set-address-values";
import { Google } from "@/lib/icons/google";

const schema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  province: z.string().min(1, { message: "State is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  address_1: z.string().min(1, { message: "Address is required" }),
  address_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  postal_code: z.string().min(1, { message: "Postal code is required" }),
  country_code: z.string().min(1, { message: "Country is required" }),
});

export type GeneralFormData = z.infer<typeof schema>;

export const GeneralForm = ({
  setStep,
  step,
}: {
  setStep: (step: "general" | "shipping" | "payment") => void;
  step: "general" | "shipping" | "payment";
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GeneralFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country_code: "us",
    },
  });

  const {
    setValue: setAddressValue,
    suggestions,
    ready,
    handleSelect: handleAddressSelect,
  } = useAddressAutocomplete();
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);

  const [isLoading, setIsLoading] = useState(false);
  const { cart, setCart, fields } = useCart();

  const onSubmit = async (data: GeneralFormData) => {
    if (!cart) return;

    // check if no changes, continue to next step
    if (
      cart.email === data.email &&
      (cart.shipping_address?.phone || "") === data.phone &&
      cart.shipping_address?.first_name === data.first_name &&
      cart.shipping_address?.last_name === data.last_name &&
      cart.shipping_address?.address_1 === data.address_1 &&
      (cart.shipping_address?.address_2 || "") === data.address_2 &&
      cart.shipping_address?.city === data.city &&
      cart.shipping_address?.province === data.province &&
      cart.shipping_address?.postal_code === data.postal_code &&
      cart.shipping_address?.country_code === data.country_code
    ) {
      setStep("shipping");
      window.scrollTo({ top: 0 });
      return;
    }

    setIsLoading(true);

    try {
      const updatedCartResponse = await medusa.store.cart.update(
        cart.id,
        {
          email: data.email,
          shipping_address: {
            ...(data.phone && { phone: data.phone }),
            ...(data.address_2 && { address_2: data.address_2 }),
            first_name: data.first_name,
            last_name: data.last_name,
            address_1: data.address_1,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            country_code: data.country_code,
          },
        },
        { fields },
      );

      // add the first shipping option to the cart by default
      if (!cart.shipping_methods?.length) {
        const response = await medusa.store.cart.addShippingMethod(
          cart.id,
          {
            option_id: shippingOptions[0].id,
          },
          { fields },
        );
        setCart(response.cart as ExtendedStoreCart);
        setStep("shipping");
        window.scrollTo({ top: 0 });
        return;
      }

      setCart(updatedCartResponse.cart as ExtendedStoreCart);
      setStep("shipping");
      window.scrollTo({ top: 0 });
    } catch (e) {
      console.log(e);
      if (e instanceof Error && e.message.includes("Customer with email")) {
        // create a new cart
        const newCartResponse = await medusa.store.cart.create({
          email: data.email,
          shipping_address: {
            ...(data.phone && { phone: data.phone }),
            ...(data.address_2 && { address_2: data.address_2 }),
            first_name: data.first_name,
            last_name: data.last_name,
            address_1: data.address_1,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            country_code: data.country_code,
          },
          ...(cart.promotions.length && { promo_codes: [cart.promotions[0].code] }),
          ...(cart.items && {
            items: cart.items?.map((item) => ({
              variant_id: item.variant_id as string,
              quantity: item.quantity,
            })),
          }),
        });

        if (cart.shipping_methods?.length) {
          // add the selected shipping option to the cart from original cart
          const response = await medusa.store.cart.addShippingMethod(
            newCartResponse.cart.id,
            {
              option_id: cart.shipping_methods[0].shipping_option_id as string,
            },
            { fields },
          );
          localStorage.setItem("cart_id", response.cart.id);
          setCart(response.cart as ExtendedStoreCart);
          setStep("shipping");
          window.scrollTo({ top: 0 });
        } else {
          // add the first shipping option to the cart
          const response = await medusa.store.cart.addShippingMethod(
            newCartResponse.cart.id,
            {
              option_id: shippingOptions[0].id,
            },
            { fields },
          );
          localStorage.setItem("cart_id", response.cart.id);
          setCart(response.cart as ExtendedStoreCart);
          setStep("shipping");
          window.scrollTo({ top: 0 });
        }
      }
      toast.error("Error setting general info");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!cart) return;

    // set the values of the form from the cart
    if (cart.email) setValue("email", cart.email);
    if (cart.shipping_address) {
      Object.entries(cart.shipping_address).forEach(([key, value]) => {
        if (key === "province" && value) {
          setValue("province", value, { shouldValidate: true });
          return;
        }
        if (value) setValue(key as keyof GeneralFormData, value);
      });
    }
  }, [cart, step]);

  const address1 = watch("address_1");
  useEffect(() => {
    if (!ready) return;
    setAddressValue(address1);
    setSelectedAddressIndex(-1);
  }, [address1, ready]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-8 pl-0 max-md:p-4 max-md:pb-12"
      autoComplete="off"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <div className="space-y-2">
        <Text weight="plus">Contact info</Text>
        <div className="flex gap-3 max-[900px]:flex-col">
          <FloatingLabelInput
            label="Email"
            {...register("email")}
            className="w-full"
            type="email"
            isRequired
            formValue={watch("email")}
            aria-invalid={!!errors.email}
          />
          <FloatingLabelInput
            label="Phone"
            {...register("phone")}
            className="w-full"
            type="phone"
            formValue={watch("phone")}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Text weight="plus">Shipping address</Text>
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
                        setSelectedAddressIndex((prev) => (prev + 1) % suggestions.data.length);
                        break;
                      case "ArrowUp":
                        e.preventDefault();
                        setSelectedAddressIndex(
                          (prev) => (prev - 1 + suggestions.data.length) % suggestions.data.length,
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
              name="state"
              // open={true}
              value={watch("province")}
              onValueChange={(value) =>
                value ? setValue("province", value, { shouldValidate: true }) : ""
              }
            >
              <Select.Trigger
                className={clx(
                  "h-[42px] px-3 pb-1 pt-4 [&>svg]:relative [&>svg]:top-[-5px]",
                  errors.province && "shadow-borders-error",
                )}
              >
                <Select.Value />
              </Select.Trigger>
              <Select.Content collisionPadding={16}>
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
              <span className="relative -top-0.5 left-[1px] text-red-600 dark:text-red-400">*</span>
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

      <Button isLoading={isLoading}>Continue to shipping</Button>
    </form>
  );
};
