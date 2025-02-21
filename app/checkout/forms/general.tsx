"use client";

import { FloatingLabelInput } from "@/components/ui/custom/floating-label-input";
import { Text, Select, Button, clx } from "@medusajs/ui";
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

type GeneralFormData = z.infer<typeof schema>;

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

  console.log(errors.province);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 pl-0 max-md:p-4 max-md:pb-12">
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
              name="state"
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
                "pointer-events-none absolute left-3 top-3 text-ui-fg-muted transition-all group-data-[empty=false]:top-0.5 group-data-[empty=false]:text-[10px] group-data-[empty=false]:text-subtle-foreground"
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
                "pointer-events-none absolute left-3 top-0.5 text-[10px] text-subtle-foreground transition-all"
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
