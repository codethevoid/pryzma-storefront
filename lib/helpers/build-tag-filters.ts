import type { Filter } from "@/types";

export const buildTagFilters = (filters: Filter[]) => {
  // Group filters by category
  const filtersByCategory = filters.reduce(
    (acc, filter) => {
      if (!acc[filter.category]) {
        acc[filter.category] = [];
      }
      acc[filter.category].push(filter.value);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  // Build the $and conditions
  const conditions = Object.entries(filtersByCategory).map(([, values], index) => ({
    [`$and[${index}][tag_id]`]: values,
  }));

  return Object.assign({}, ...conditions);
};
