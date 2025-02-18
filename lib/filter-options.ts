import { TAG_IDS } from "./identifiers";

export const SWITCH_FILTER_OPTIONS = {
  type: [
    { category: "type", label: "linear", value: TAG_IDS.LINEAR },
    { category: "type", label: "tactile", value: TAG_IDS.TACTILE },
    { category: "type", label: "clicky", value: TAG_IDS.CLICKY },
    { category: "type", label: "silent", value: TAG_IDS.SILENT },
  ],
  lubricant: [
    { category: "lubricant", label: "prelubed", value: TAG_IDS.PRELUBED },
    { category: "lubricant", label: "unlubed", value: TAG_IDS.UNLUBED },
  ],
  brand: [
    { category: "brand", label: "akko", value: TAG_IDS.AKKO },
    { category: "brand", label: "gateron", value: TAG_IDS.GATERON },
    { category: "brand", label: "ktt", value: TAG_IDS.KTT },
    { category: "brand", label: "pryzma", value: TAG_IDS.PRYZMA },
    { category: "brand", label: "tecsee", value: TAG_IDS.TECSEE },
  ],
};

export const PRODUCT_FILTER_OPTIONS = {
  product_type: [
    { category: "product_type", label: "Switches", value: TAG_IDS.SWITCH },
    { category: "product_type", label: "Lubricants", value: TAG_IDS.LUBRICANT },
    { category: "product_type", label: "Accessories", value: TAG_IDS.ACCESSORY },
  ],
  switch_type: [
    { category: "switch_type", label: "Linear", value: TAG_IDS.LINEAR },
    { category: "switch_type", label: "Tactile", value: TAG_IDS.TACTILE },
    { category: "switch_type", label: "Clicky", value: TAG_IDS.CLICKY },
    { category: "switch_type", label: "Silent", value: TAG_IDS.SILENT },
  ],
  switch_lubricant: [
    { category: "switch_lubricant", label: "Prelubed", value: TAG_IDS.PRELUBED },
    { category: "switch_lubricant", label: "Unlubed", value: TAG_IDS.UNLUBED },
  ],
  brand: [
    { category: "brand", label: "Akko", value: TAG_IDS.AKKO },
    { category: "brand", label: "Durock", value: TAG_IDS.DUROCK },
    { category: "brand", label: "Gateron", value: TAG_IDS.GATERON },
    { category: "brand", label: "Krytox", value: TAG_IDS.KRYTOX },
    { category: "brand", label: "KTT", value: TAG_IDS.KTT },
    { category: "brand", label: "Pryzma", value: TAG_IDS.PRYZMA },
    { category: "brand", label: "Tecsee", value: TAG_IDS.TECSEE },
  ],
};
