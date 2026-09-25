import { describe, expect, it } from "@jest/globals";

import {
  calculatorReducer,
  INITIAL_CALCULATOR_STATE,
  isCalculationResponseReady,
  isCurrentStepAnswered,
} from "../state";
import { CalculatorStep } from "../types";

const product = {
  name: "sushi",
  label: "sushis",
  prefix: "des",
  variants: [{ type: "maki", count: 12 }],
};

const productWithoutVariants = {
  name: "freshSalmon",
  label: "fresh salmon",
  variants: [],
};

describe("calculator workflow", () => {
  it("requires a product before continuing", () => {
    expect(isCurrentStepAnswered(INITIAL_CALCULATOR_STATE)).toBe(false);

    const state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "toggleProduct",
      product,
    });

    expect(isCurrentStepAnswered(state)).toBe(true);
  });

  it("shows variants after frequency before showing the summary", () => {
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "toggleProduct",
      product,
    });
    state = calculatorReducer(state, { type: "next" });

    expect(state.step).toBe(CalculatorStep.Frequency);
    expect(isCurrentStepAnswered(state)).toBe(false);

    state = calculatorReducer(state, {
      type: "setFrequency",
      productIndex: 0,
      frequency: "weekly",
      frequencyLabel: "1 time per week",
      advanceToVariant: true,
    });

    expect(state.step).toBe(CalculatorStep.Variant);
    expect(isCurrentStepAnswered(state)).toBe(true);

    state = calculatorReducer(state, { type: "next" });

    expect(state.step).toBe(CalculatorStep.Summary);
  });

  it("shows the current product variants before the next product frequency", () => {
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "toggleProduct",
      product,
    });
    state = calculatorReducer(state, {
      type: "toggleProduct",
      product: productWithoutVariants,
    });
    state = calculatorReducer(state, { type: "next" });
    state = calculatorReducer(state, {
      type: "setFrequency",
      productIndex: 0,
      frequency: "weekly",
      advanceToVariant: true,
    });

    expect(state).toMatchObject({
      step: CalculatorStep.Variant,
      productIndex: 0,
    });

    state = calculatorReducer(state, { type: "next" });

    expect(state).toMatchObject({
      step: CalculatorStep.Frequency,
      productIndex: 1,
    });
  });

  it("skips variants when the product has none", () => {
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "toggleProduct",
      product: productWithoutVariants,
    });
    state = calculatorReducer(state, { type: "next" });
    state = calculatorReducer(state, {
      type: "setFrequency",
      productIndex: 0,
      frequency: "weekly",
    });
    state = calculatorReducer(state, { type: "next" });

    expect(state.step).toBe(CalculatorStep.Summary);
  });

  it("updates custom frequencies and variant counts", () => {
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "toggleProduct",
      product,
    });
    state = calculatorReducer(state, {
      type: "setFrequency",
      productIndex: 0,
      frequency: "otherWeekly",
      frequencyLabel: "times per week",
      occurrence: 3,
    });
    state = calculatorReducer(state, {
      type: "setVariantCount",
      productIndex: 0,
      variantType: "maki",
      count: 8,
    });

    expect(state.products[0]).toMatchObject({
      frequency: "otherWeekly",
      occurrence: 3,
      variants: [{ type: "maki", count: 8 }],
    });
  });

  it("supports back navigation and reset", () => {
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "toggleProduct",
      product,
    });
    state = calculatorReducer(state, { type: "next" });
    state = calculatorReducer(state, { type: "back" });

    expect(state.step).toBe(CalculatorStep.Selection);
    expect(state.products).toHaveLength(1);

    expect(calculatorReducer(state, { type: "reset" })).toEqual(
      INITIAL_CALCULATOR_STATE,
    );
  });

  it("moves to the result step when the calculation succeeds", () => {
    const response = {
      totalConsoInKg: 1.5,
      consoPerProduct: { sushi: { weightInKg: 1.5, occurrencePerYear: 24 } },
      impact: "medium" as const,
    };
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "startLoading",
    });
    state = calculatorReducer(state, {
      type: "calculationSucceeded",
      response,
    });

    expect(state.step).toBe(CalculatorStep.Result);
    expect(state.calculationResponse).toEqual(response);
    expect(isCalculationResponseReady(state)).toBe(true);
    expect(state.reduceImpact).toEqual({
      activeAccordionIndex: 0,
      selectedProductKey: "sushi",
      replacementFrequencyPerYear: 24,
      selectedAlternative: null,
    });
  });

  it("advances the reduce-impact wizard as the user answers each step", () => {
    const response = {
      totalConsoInKg: 3,
      consoPerProduct: {
        sushi: { weightInKg: 2, occurrencePerYear: 24 },
        pokeBowl: { weightInKg: 1, occurrencePerYear: 12 },
      },
      impact: "high" as const,
    };
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "calculationSucceeded",
      response,
    });

    state = calculatorReducer(state, {
      type: "selectReplacementProduct",
      productKey: "pokeBowl",
    });
    expect(state.reduceImpact).toMatchObject({
      activeAccordionIndex: 1,
      selectedProductKey: "pokeBowl",
      replacementFrequencyPerYear: 12,
    });

    state = calculatorReducer(state, {
      type: "setReplacementFrequency",
      occurrencePerYear: 5,
    });
    expect(state.reduceImpact.replacementFrequencyPerYear).toBe(5);

    state = calculatorReducer(state, { type: "confirmReplacementFrequency" });
    expect(state.reduceImpact.activeAccordionIndex).toBe(2);

    state = calculatorReducer(state, {
      type: "selectAlternative",
      alternative: "algae",
    });
    expect(state.reduceImpact.selectedAlternative).toBe("algae");
  });

  it("moves to the error step when the calculation fails", () => {
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "startLoading",
    });
    state = calculatorReducer(state, {
      type: "calculationFailed",
      error: "Submission failed",
    });

    expect(state.step).toBe(CalculatorStep.Error);
    expect(state.calculationError).toBe("Submission failed");

    state = calculatorReducer(state, { type: "back" });
    expect(state.step).toBe(CalculatorStep.Summary);
    expect(state.calculationError).toBeNull();
  });

  it("reverses through variants and the previous product", () => {
    let state = calculatorReducer(INITIAL_CALCULATOR_STATE, {
      type: "toggleProduct",
      product,
    });
    state = calculatorReducer(state, {
      type: "toggleProduct",
      product: productWithoutVariants,
    });
    state = calculatorReducer(state, { type: "next" });
    state = calculatorReducer(state, {
      type: "setFrequency",
      productIndex: 0,
      frequency: "weekly",
    });
    state = calculatorReducer(state, { type: "next" });

    expect(state.step).toBe(CalculatorStep.Variant);

    state = calculatorReducer(state, { type: "back" });
    expect(state.step).toBe(CalculatorStep.Frequency);
    expect(state.productIndex).toBe(0);

    state = calculatorReducer(state, { type: "next" });
    state = calculatorReducer(state, { type: "next" });
    expect(state.step).toBe(CalculatorStep.Frequency);
    expect(state.productIndex).toBe(1);

    state = calculatorReducer(state, { type: "back" });
    expect(state.step).toBe(CalculatorStep.Variant);
    expect(state.productIndex).toBe(0);
  });

  it("returns from summary to the last applicable product step", () => {
    const state = {
      ...INITIAL_CALCULATOR_STATE,
      step: CalculatorStep.Summary,
      products: [productWithoutVariants, product],
      productIndex: 1,
    };

    expect(calculatorReducer(state, { type: "back" })).toMatchObject({
      step: CalculatorStep.Variant,
      productIndex: 1,
    });
  });
});
