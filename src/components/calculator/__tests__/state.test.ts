import { describe, expect, it } from "@jest/globals";
import {
  calculatorReducer,
  INITIAL_CALCULATOR_STATE,
  isCurrentStepAnswered,
} from "../state";
import { CalculatorStep } from "../types";

const product = {
  name: "sushi",
  label: "sushis",
  prefix: "des",
  variants: [{ type: "maki", count: 12 }],
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

  it("moves through each selected product before showing the summary", () => {
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
});
