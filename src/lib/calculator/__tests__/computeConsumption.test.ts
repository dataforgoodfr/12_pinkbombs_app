import { describe, expect, it } from "@jest/globals";

import { computeConsumption, getImpactLevel } from "../computeConsumption";
import type { UserProductConsumption } from "../types";

describe("getImpactLevel", () => {
  it("returns neutral at exactly 0kg", () => {
    expect(getImpactLevel(0)).toBe("neutral");
  });

  it("returns low for (0,1)", () => {
    expect(getImpactLevel(0.5)).toBe("low");
    expect(getImpactLevel(0.999)).toBe("low");
  });

  it("returns medium for [1,2)", () => {
    expect(getImpactLevel(1)).toBe("medium");
    expect(getImpactLevel(1.999)).toBe("medium");
  });

  it("returns high for [2,4)", () => {
    expect(getImpactLevel(2)).toBe("high");
    expect(getImpactLevel(3.999)).toBe("high");
  });

  it("returns veryHigh for [4,Infinity)", () => {
    expect(getImpactLevel(4)).toBe("veryHigh");
    expect(getImpactLevel(100)).toBe("veryHigh");
  });
});

describe("computeConsumption", () => {
  it("returns a neutral result for no consumption without a frequency", () => {
    const result = computeConsumption([
      { name: "none", label: "No salmon", variants: [] },
    ]);

    expect(result).toEqual({
      totalConsoInKg: 0,
      consoPerProduct: {},
      impact: "neutral",
    });
  });

  it("computes weight for a product without variants (pokeBowl, semiWeekly)", () => {
    const products: UserProductConsumption[] = [
      {
        name: "pokeBowl",
        label: "poké bowls",
        variants: [],
        frequency: "semiWeekly",
        frequencyLabel: "2 fois par semaine",
      },
    ];

    const result = computeConsumption(products);

    // 2 occurrences * 52 weeks * 300g = 31200g = 31.2kg
    expect(result.consoPerProduct.pokeBowl.weightInKg).toBeCloseTo(31.2);
    expect(result.consoPerProduct.pokeBowl.occurrencePerYear).toBe(104);
    expect(result.totalConsoInKg).toBeCloseTo(31.2);
    expect(result.impact).toBe("veryHigh");
  });

  it("keeps sushi variants (maki, nigiri, sashimi) as separate products", () => {
    const products: UserProductConsumption[] = [
      {
        name: "sushi",
        label: "sushis",
        variants: [
          { type: "maki", count: 12 },
          { type: "nigiri", count: 6 },
          { type: "sashimi", count: 0 },
        ],
        frequency: "semiMonthly",
        frequencyLabel: "2 fois par mois",
      },
    ];

    const result = computeConsumption(products);

    // 2 occurrences * 12 months * 12 * 13.3g = 3830.4g = 3.8304kg
    expect(result.consoPerProduct.maki.weightInKg).toBeCloseTo(3.8304, 4);
    expect(result.consoPerProduct.maki.occurrencePerYear).toBe(24);
    // 2 occurrences * 12 months * 6 * 35g = 5040g = 5.04kg
    expect(result.consoPerProduct.nigiri.weightInKg).toBeCloseTo(5.04, 4);
    expect(result.consoPerProduct.nigiri.occurrencePerYear).toBe(24);
    expect(result.consoPerProduct.sashimi).toBeUndefined();
    expect(result.consoPerProduct.sushi).toBeUndefined();
  });

  it("falls back to product name grammage for smokedSalmon slices (fr variant type)", () => {
    const products: UserProductConsumption[] = [
      {
        name: "smokedSalmon",
        label: "saumon fumé en tranche",
        variants: [{ type: "tranche", count: 3 }],
        frequency: "weekly",
        frequencyLabel: "1 fois par semaine",
      },
    ];

    const result = computeConsumption(products);

    // 1 * 52 * 3 * 115.2g = 17971.2g = 17.9712kg
    expect(result.consoPerProduct.smokedSalmon.weightInKg).toBeCloseTo(17.9712);
    expect(result.consoPerProduct.smokedSalmon.occurrencePerYear).toBe(52);
  });

  it("uses the custom occurrence for otherWeekly/otherYearly frequencies", () => {
    const products: UserProductConsumption[] = [
      {
        name: "appetizer",
        label: "amuse-bouches",
        variants: [],
        frequency: "otherYearly",
        frequencyLabel: "5 fois par an",
        occurrence: 5,
      },
    ];

    const result = computeConsumption(products);

    // 5 * 1 * 99.8g = 499g = 0.499kg
    expect(result.consoPerProduct.appetizer.weightInKg).toBeCloseTo(0.499);
  });

  it("sorts consoPerProduct descending by value and sums totalConsoInKg", () => {
    const products: UserProductConsumption[] = [
      {
        name: "appetizer",
        label: "amuse-bouches",
        variants: [],
        frequency: "quarterly",
        frequencyLabel: "1 fois par trimestre",
      },
      {
        name: "pokeBowl",
        label: "poké bowls",
        variants: [],
        frequency: "semiWeekly",
        frequencyLabel: "2 fois par semaine",
      },
    ];

    const result = computeConsumption(products);

    expect(Object.keys(result.consoPerProduct)).toEqual([
      "pokeBowl",
      "appetizer",
    ]);
    expect(result.totalConsoInKg).toBeCloseTo(
      result.consoPerProduct.pokeBowl.weightInKg +
        result.consoPerProduct.appetizer.weightInKg,
    );
  });

  it("matches the reported curl payload regression case", () => {
    const products: UserProductConsumption[] = [
      {
        name: "pokeBowl",
        label: "poké bowls",
        prefix: "des",
        variants: [],
        frequency: "semiWeekly",
        frequencyLabel: "2 fois par semaine",
      },
      {
        name: "sushi",
        label: "sushis (makis, nigiris, sashimis)",
        prefix: "des",
        variants: [
          { type: "maki", count: 12 },
          { type: "nigiri", count: 6 },
          { type: "sashimi", count: 0 },
        ],
        frequency: "semiMonthly",
        frequencyLabel: "2 fois par mois",
      },
      {
        name: "appetizer",
        label: "amuse-bouches",
        prefix: "des",
        variants: [],
        frequency: "quarterly",
        frequencyLabel: "1 fois par trimestre",
      },
    ];

    const result = computeConsumption(products);

    expect(result.consoPerProduct).toHaveProperty("pokeBowl");
    expect(result.consoPerProduct).toHaveProperty("maki");
    expect(result.consoPerProduct).toHaveProperty("nigiri");
    expect(result.consoPerProduct.sashimi).toBeUndefined();
    expect(result.consoPerProduct).toHaveProperty("appetizer");
    expect(result.consoPerProduct.sushi).toBeUndefined();
    expect(result.totalConsoInKg).toBeGreaterThan(0);
  });
});
