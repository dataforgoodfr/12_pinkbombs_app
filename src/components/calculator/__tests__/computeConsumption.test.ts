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

    // 2 occurrences * 52 weeks * 150g = 15600g = 15.6kg
    expect(result.consoPerProduct.pokeBowl).toBeCloseTo(15.6);
    expect(result.totalConsoInKg).toBeCloseTo(15.6);
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

    // 2 occurrences * 12 months * 12 * 6.67g = 1920.96g = 1.92096kg
    expect(result.consoPerProduct.maki).toBeCloseTo(1.92096, 4);
    // 2 occurrences * 12 months * 6 * 17.5g = 2520g = 2.52kg
    expect(result.consoPerProduct.nigiri).toBeCloseTo(2.52, 4);
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

    // 1 * 52 * 3 * 30g = 4680g = 4.68kg
    expect(result.consoPerProduct.smokedSalmon).toBeCloseTo(4.68);
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

    // 5 * 1 * 26g = 130g = 0.13kg
    expect(result.consoPerProduct.appetizer).toBeCloseTo(0.13);
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
      result.consoPerProduct.pokeBowl + result.consoPerProduct.appetizer,
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
