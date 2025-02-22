"use client";

import { UseFormSetValue, Path, PathValue } from "react-hook-form";
import { GeocodeResult } from "use-places-autocomplete";

type FormFields = {
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
};

type Props<T extends FormFields> = {
  place: GeocodeResult;
  setValue: UseFormSetValue<T>;
};

export const setAddressValues = <T extends FormFields>({ place, setValue }: Props<T>) => {
  if (!place || !place.address_components) return;

  // reset address_2
  setValue("address_2" as Path<T>, "" as PathValue<T, Path<T>>);

  let streetNumber = "";
  let route = "";

  place.address_components?.forEach((component) => {
    const types = component.types;
    if (types.includes("street_number")) {
      streetNumber = component.long_name;
    }
    if (types.includes("route")) {
      route = component.long_name;
    }
    if (types.includes("locality")) {
      setValue("city" as Path<T>, component.long_name as PathValue<T, Path<T>>);
    }
    if (types.includes("administrative_area_level_1")) {
      setValue("province" as Path<T>, component.short_name as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    }
    if (types.includes("postal_code")) {
      setValue("postal_code" as Path<T>, component.short_name as PathValue<T, Path<T>>);
    }
  });

  setValue("address_1" as Path<T>, `${streetNumber} ${route}` as PathValue<T, Path<T>>);
};
