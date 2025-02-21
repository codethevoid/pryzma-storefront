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
        className="h-[42px] px-3 pb-1 pt-4"
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
        className={clx(
          "absolute left-3 top-3 origin-top-left transition-all duration-150",
          // Default state (placeholder)
          "text-ui-fg-muted",
          // Focused or filled state
          "group-focus-within:top-1 group-focus-within:scale-[0.77] group-focus-within:text-subtle-foreground",
          "group-data-[empty=false]:top-1 group-data-[empty=false]:scale-[0.77] group-data-[empty=false]:text-subtle-foreground",
        )}
      >
        {label}
        {isRequired && (
          <span className="relative -top-0.5 left-[1px] text-red-600 dark:text-red-400">*</span>
        )}
      </Text>
    </div>
  );
};
