"use client";
import { FloatingLabelInput } from "./floating-label-input";
import { Autocomplete, useLoadScript, Libraries } from "@react-google-maps/api";
import { ReactNode, useRef } from "react";
import { UseFormSetValue, Path, PathValue } from "react-hook-form";

type FormFields = {
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
};

type Props<T extends FormFields> = {
  children: ReactNode;
  setValue: UseFormSetValue<T>;
};

const libraries: Libraries = ["places"];

export const AddressAutocompleteProvider = <T extends FormFields>({
  children,
  setValue,
}: Props<T>) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!,
    libraries,
  });
  const ref = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    ref.current = autocomplete;
  };

  if (!isLoaded) return <FloatingLabelInput label="Address" isRequired />;

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={() => {
        console.log("place changed");
        const place = ref?.current?.getPlace();
        console.log(place);

        if (!place || !place.address_components) return;

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
      }}
      options={{
        types: ["address"],
        componentRestrictions: { country: "us" },
      }}
    >
      {children}
    </Autocomplete>
  );
};
