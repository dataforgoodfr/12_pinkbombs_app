import type { UserProductVariant } from "./types";

export const QUESTION_INDEX = {
  ProductSelection: 0,
  Frequency: 1,
} as const;

export const DEFAULT_PRODUCT_INDEX = 0;
export const EMPTY_OCCURRENCE = 0;
export const MIN_VARIANT_COUNT = 0;

export const FREQUENCY = {
  Weekly: "weekly",
  SemiWeekly: "semiWeekly",
  Monthly: "monthly",
  SemiMonthly: "semiMonthly",
  BiMonthly: "biMonthly",
  Quarterly: "quarterly",
  SemiAnnually: "semiAnnually",
  OtherWeekly: "otherWeekly",
  OtherYearly: "otherYearly",
} as const;

export type FrequencyName = (typeof FREQUENCY)[keyof typeof FREQUENCY];

export const DEFAULT_VARIANTS: Record<string, UserProductVariant[]> = {
  smokedSalmon: [{ type: "tranche", count: 1 }],
  sushi: [
    { type: "maki", count: 12 },
    { type: "nigiri", count: 6 },
    { type: "sashimi", count: 0 },
  ],
};

export const getDefaultVariants = (productName: string) =>
  DEFAULT_VARIANTS[productName]?.map((variant) => ({ ...variant })) ?? [];
