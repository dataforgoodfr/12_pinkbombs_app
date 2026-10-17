import { describe, expect, it } from "@jest/globals";

import { buildReducedImpactProducts } from "../submission";

describe("buildReducedImpactProducts", () => {
  it("reduces a product without variants without mutating the original", () => {
    const products = [
      {
        name: "fillet",
        label: "fillet",
        frequency: "weekly",
        variants: [],
      },
      {
        name: "pokeBowl",
        label: "poke bowls",
        frequency: "monthly",
        variants: [],
      },
    ];

    const reducedProducts = buildReducedImpactProducts(products, {
      selectedProductKey: "fillet",
      replacementFrequencyPerYear: 6,
    });

    expect(reducedProducts).toEqual([
      {
        name: "fillet",
        label: "fillet",
        frequency: "otherYearly",
        frequencyLabel: "times per year",
        occurrence: 6,
        variants: [],
      },
      products[1],
    ]);
    expect(products[0].frequency).toBe("weekly");
  });

  it("changes only the selected variant and preserves the other variants", () => {
    const products = [
      {
        name: "sushi",
        label: "sushi",
        frequency: "weekly",
        variants: [
          { type: "maki", count: 12 },
          { type: "nigiri", count: 6 },
        ],
      },
    ];

    expect(
      buildReducedImpactProducts(products, {
        selectedProductKey: "maki",
        replacementFrequencyPerYear: 10,
      }),
    ).toEqual([
      {
        name: "sushi",
        label: "sushi",
        frequency: "weekly",
        variants: [{ type: "nigiri", count: 6 }],
      },
      {
        name: "sushi",
        label: "sushi",
        frequency: "otherYearly",
        frequencyLabel: "times per year",
        occurrence: 10,
        variants: [{ type: "maki", count: 12 }],
      },
    ]);
  });
});
