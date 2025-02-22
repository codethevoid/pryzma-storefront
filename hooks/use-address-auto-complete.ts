import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";

export const useAddressAutocomplete = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete({
    callbackName: "initGooglePlaces",
    requestOptions: {
      componentRestrictions: { country: "us" },
      types: ["address"],
    },
    debounce: 50,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);

    const results = await getGeocode({ address });
    return results[0];
  };

  return { ready, value, suggestions: { status, data }, handleSelect, setValue };
};
