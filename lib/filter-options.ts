import { TAG_IDS } from "./identifiers";

export const SWITCH_FILTER_OPTIONS = {
  type: [
    { category: "type", label: "linear", value: TAG_IDS.LINEAR },
    { category: "type", label: "tactile", value: TAG_IDS.TACTILE },
    { category: "type", label: "clicky", value: TAG_IDS.CLICKY },
    { category: "type", label: "silent", value: TAG_IDS.SILENT },
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

export const FILTERS = {
  switches: SWITCH_FILTER_OPTIONS,
  samples: SWITCH_FILTER_OPTIONS,
  products: PRODUCT_FILTER_OPTIONS,
  "gateron-switches": {
    type: [
      { category: "type", label: "linear", value: TAG_IDS.LINEAR },
      { category: "type", label: "tactile", value: TAG_IDS.TACTILE },
      { category: "type", label: "clicky", value: TAG_IDS.CLICKY },
    ],
  },
  "linear-switches": {
    brand: [
      { category: "brand", label: "Akko", value: TAG_IDS.AKKO },
      { category: "brand", label: "Gateron", value: TAG_IDS.GATERON },
      { category: "brand", label: "KTT", value: TAG_IDS.KTT },
      { category: "brand", label: "Pryzma", value: TAG_IDS.PRYZMA },
      { category: "brand", label: "Tecsee", value: TAG_IDS.TECSEE },
    ],
  },
  "akko-switches": {
    type: [
      { category: "type", label: "linear", value: TAG_IDS.LINEAR },
      { category: "type", label: "tactile", value: TAG_IDS.TACTILE },
      { category: "type", label: "silent", value: TAG_IDS.SILENT },
    ],
  },
};
