export const formatCurrency = (currency: string, amount: number) => {
  return Intl.NumberFormat("en-us", {
    style: "currency",
    currency,
  }).format(amount);
};
