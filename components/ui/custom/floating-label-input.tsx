import { Input, Text, clx } from "@medusajs/ui";
import { InputHTMLAttributes, useEffect, useState } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  size?: "small" | "base";
  className?: string;
  isRequired?: boolean;
  formValue?: string;
};

export const FloatingLabelInput = ({
  label,
  size = "base",
  className,
  isRequired,
  formValue,
  ...props
}: Props) => {
  const [isEmpty, setIsEmpty] = useState(!props.value && !formValue);

  useEffect(() => {
    setIsEmpty(!props.value && !formValue);
  }, [formValue, props.value]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phone = value.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  return (
    <div className={clx("group relative", className)} data-empty={isEmpty}>
      <Input
        className="h-10.5 px-3 pb-1.5 pt-4"
        size={size}
        {...props}
        onChange={(e) => {
          if (props.type === "phone") {
            e.target.value = formatPhoneNumber(e.target.value);
          }
          setIsEmpty(e.target.value === "");
          props.onChange?.(e);
        }}
      />
      <Text
        size="small"
        className={
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle-foreground transition-all group-focus-within:top-[11px] group-focus-within:text-[10px] group-data-[empty=false]:top-[11px] group-data-[empty=false]:text-[10px]"
        }
      >
        {label}
        {isRequired && (
          <span className="relative -top-0.5 left-[1px] text-red-600 dark:text-red-400">*</span>
        )}
      </Text>
    </div>
  );
};
