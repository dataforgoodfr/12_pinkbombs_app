import { FREQUENCY, type FrequencyName } from "./constants";
import type { UserProductConsumption } from "./types";

interface Periodicity {
  occurrence: number;
  yearPeriodicity: number;
}

const GRAMS_TO_KG = 0.001;

export const PERIODICITY_TABLE: Record<FrequencyName, Periodicity> = {
  [FREQUENCY.Weekly]: { occurrence: 1, yearPeriodicity: 52 },
  [FREQUENCY.SemiWeekly]: { occurrence: 2, yearPeriodicity: 52 },
  [FREQUENCY.Monthly]: { occurrence: 1, yearPeriodicity: 12 },
  [FREQUENCY.SemiMonthly]: { occurrence: 2, yearPeriodicity: 12 },
  [FREQUENCY.BiMonthly]: { occurrence: 1, yearPeriodicity: 6 },
  [FREQUENCY.Quarterly]: { occurrence: 1, yearPeriodicity: 4 },
  [FREQUENCY.SemiAnnually]: { occurrence: 2, yearPeriodicity: 1 },
  // occurrence is user-provided for custom frequencies, overridden in getYearlyOccurrences
  [FREQUENCY.OtherWeekly]: { occurrence: 0, yearPeriodicity: 52 },
  [FREQUENCY.OtherYearly]: { occurrence: 0, yearPeriodicity: 1 },
};

export const WEIGHT_TABLE_IN_GRAMS: Record<string, number> = {
  fillet: 110,
  maki: 6.67,
  nigiri: 17.5,
  sashimi: 22.67,
  pokeBowl: 150,
  smokedSalmon: 30,
  quicheSandwich: 30,
  appetizer: 26,
  pasta: 80,
};

const CUSTOM_FREQUENCIES: FrequencyName[] = [
  FREQUENCY.OtherWeekly,
  FREQUENCY.OtherYearly,
];

export type ImpactLevel = "neutral" | "low" | "medium" | "high" | "veryHigh";

export const getImpactLevel = (totalConsoInKg: number): ImpactLevel => {
  if (totalConsoInKg === 0) return "neutral";
  if (totalConsoInKg < 1) return "low";
  if (totalConsoInKg < 2) return "medium";
  if (totalConsoInKg < 4) return "high";
  return "veryHigh";
};

export const getYearlyOccurrences = (
  product: UserProductConsumption,
): number => {
  const frequency = product.frequency as FrequencyName | undefined;
  if (!frequency || !(frequency in PERIODICITY_TABLE)) {
    return 0;
  }

  const periodicity = PERIODICITY_TABLE[frequency];
  const occurrence = CUSTOM_FREQUENCIES.includes(frequency)
    ? product.occurrence ?? 0
    : periodicity.occurrence;

  return occurrence * periodicity.yearPeriodicity;
};

export const getProductWeightEntries = (
  product: UserProductConsumption,
): { key: string; weightInGrams: number; occurrencePerYear: number }[] => {
  const yearlyOccurrences = getYearlyOccurrences(product);

  if (product.variants.length === 0) {
    return [
      {
        key: product.name,
        weightInGrams:
          yearlyOccurrences * (WEIGHT_TABLE_IN_GRAMS[product.name] ?? 0),
        occurrencePerYear: yearlyOccurrences,
      },
    ];
  }

  return product.variants.map((variant) => {
    const key =
      variant.type in WEIGHT_TABLE_IN_GRAMS ? variant.type : product.name;
    const grammagePerUnitG = WEIGHT_TABLE_IN_GRAMS[key] ?? 0;

    return {
      key,
      weightInGrams: yearlyOccurrences * variant.count * grammagePerUnitG,
      occurrencePerYear: yearlyOccurrences,
    };
  });
};

export interface ProductConsumptionEntry {
  weightInKg: number;
  occurrencePerYear: number;
}

export interface ConsumptionResult {
  totalConsoInKg: number;
  consoPerProduct: Record<string, ProductConsumptionEntry>;
  impact: ImpactLevel;
}

export const computeConsumption = (
  products: UserProductConsumption[],
): ConsumptionResult => {
  const entriesByKey = new Map<string, ProductConsumptionEntry>();

  for (const product of products) {
    for (const entry of getProductWeightEntries(product)) {
      const weightInKg = entry.weightInGrams * GRAMS_TO_KG;
      const current = entriesByKey.get(entry.key) ?? {
        weightInKg: 0,
        occurrencePerYear: 0,
      };
      entriesByKey.set(entry.key, {
        weightInKg: current.weightInKg + weightInKg,
        occurrencePerYear: current.occurrencePerYear + entry.occurrencePerYear,
      });
    }
  }

  const consoPerProduct = Object.fromEntries(
    Array.from(entriesByKey.entries())
      .filter(([, entry]) => entry.weightInKg > 0)
      .sort(([, a], [, b]) => b.weightInKg - a.weightInKg),
  );

  const totalConsoInKg = Array.from(entriesByKey.values()).reduce(
    (sum, entry) => sum + entry.weightInKg,
    0,
  );

  return {
    totalConsoInKg,
    consoPerProduct,
    impact: getImpactLevel(totalConsoInKg),
  };
};
