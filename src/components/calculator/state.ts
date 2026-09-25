import {
  DEFAULT_PRODUCT_INDEX,
  EMPTY_OCCURRENCE,
  MIN_VARIANT_COUNT,
  QUESTION_INDEX,
} from "./constants";
import type { CalculatorSubmissionResponse } from "./submission";
import {
  type CalculatorState,
  CalculatorStep,
  type ReduceImpactState,
  type UserProductConsumption,
} from "./types";

const INITIAL_REDUCE_IMPACT_STATE: ReduceImpactState = {
  activeAccordionIndex: 0,
  selectedProductKey: null,
  replacementFrequencyPerYear: null,
  selectedAlternative: null,
};

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  step: CalculatorStep.Selection,
  questionIndex: QUESTION_INDEX.ProductSelection,
  productIndex: DEFAULT_PRODUCT_INDEX,
  products: [],
  calculationResponse: null,
  calculationError: null,
  reduceImpact: INITIAL_REDUCE_IMPACT_STATE,
};

export type CalculatorAction =
  | { type: "toggleProduct"; product: UserProductConsumption }
  | {
      type: "setFrequency";
      productIndex: number;
      frequency: string | undefined;
      frequencyLabel?: string;
      occurrence?: number;
      advanceToVariant?: boolean;
    }
  | {
      type: "setVariantCount";
      productIndex: number;
      variantType: string;
      count: number;
    }
  | { type: "next" }
  | { type: "back" }
  | { type: "startLoading" }
  | { type: "calculationSucceeded"; response: CalculatorSubmissionResponse }
  | { type: "calculationFailed"; error: string }
  | { type: "selectReplacementProduct"; productKey: string }
  | { type: "setReplacementFrequency"; occurrencePerYear: number }
  | { type: "confirmReplacementFrequency" }
  | { type: "selectAlternative"; alternative: string }
  | { type: "setActiveAccordionIndex"; index: 0 | 1 | 2 }
  | { type: "reset" };

const updateProduct = (
  state: CalculatorState,
  productIndex: number,
  update: (product: UserProductConsumption) => UserProductConsumption,
) => ({
  ...state,
  products: state.products.map((product, index) =>
    index === productIndex ? update(product) : product,
  ),
});

const getLastProductStep = (product?: UserProductConsumption) =>
  product?.variants.length ? CalculatorStep.Variant : CalculatorStep.Frequency;

const advanceFromProduct = (state: CalculatorState): CalculatorState => {
  if (state.productIndex < state.products.length - 1) {
    return {
      ...state,
      step: CalculatorStep.Frequency,
      productIndex: state.productIndex + 1,
    };
  }

  return { ...state, step: CalculatorStep.Summary };
};

const getInitialReduceImpactState = (
  response: CalculatorSubmissionResponse,
): ReduceImpactState => {
  const [selectedProductKey, selectedEntry] =
    Object.entries(response.consoPerProduct)[0] ?? [];

  return {
    activeAccordionIndex: 0,
    selectedProductKey: selectedProductKey ?? null,
    replacementFrequencyPerYear: selectedEntry?.occurrencePerYear ?? null,
    selectedAlternative: null,
  };
};

export const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState => {
  switch (action.type) {
    case "toggleProduct": {
      if (action.product.name === "none") {
        return { ...INITIAL_CALCULATOR_STATE, products: [action.product] };
      }

      const products = state.products.filter(
        (product) => product.name !== "none",
      );
      const isSelected = products.some(
        (product) => product.name === action.product.name,
      );

      return {
        ...state,
        products: isSelected
          ? products.filter((product) => product.name !== action.product.name)
          : [...products, action.product],
      };
    }
    case "setFrequency": {
      const nextState = updateProduct(
        state,
        action.productIndex,
        (product) => ({
          ...product,
          frequency: action.frequency,
          frequencyLabel: action.frequencyLabel,
          occurrence: action.occurrence,
        }),
      );

      if (
        action.advanceToVariant &&
        action.frequency &&
        state.products[action.productIndex]?.variants.length
      ) {
        return { ...nextState, step: CalculatorStep.Variant };
      }

      return nextState;
    }
    case "setVariantCount":
      return updateProduct(state, action.productIndex, (product) => ({
        ...product,
        variants: product.variants.map((variant) =>
          variant.type === action.variantType
            ? { ...variant, count: Math.max(MIN_VARIANT_COUNT, action.count) }
            : variant,
        ),
      }));
    case "next":
      if (state.step === CalculatorStep.Selection) {
        return {
          ...state,
          step: CalculatorStep.Frequency,
          questionIndex: QUESTION_INDEX.Frequency,
          productIndex: DEFAULT_PRODUCT_INDEX,
        };
      }
      if (state.step === CalculatorStep.Frequency) {
        if (state.products[state.productIndex]?.variants.length) {
          return { ...state, step: CalculatorStep.Variant };
        }

        return advanceFromProduct(state);
      }
      if (state.step === CalculatorStep.Variant) {
        return advanceFromProduct(state);
      }
      return { ...state, step: CalculatorStep.Summary };
    case "back":
      if (state.step === CalculatorStep.Error) {
        return {
          ...state,
          step: CalculatorStep.Summary,
          calculationError: null,
        };
      }
      if (state.step === CalculatorStep.Summary) {
        const productIndex = Math.max(
          DEFAULT_PRODUCT_INDEX,
          state.products.length - 1,
        );

        return {
          ...state,
          step: getLastProductStep(state.products[productIndex]),
          questionIndex: QUESTION_INDEX.Frequency,
          productIndex,
        };
      }
      if (state.step === CalculatorStep.Variant) {
        return { ...state, step: CalculatorStep.Frequency };
      }
      if (
        state.step === CalculatorStep.Frequency &&
        state.productIndex > DEFAULT_PRODUCT_INDEX
      ) {
        const productIndex = state.productIndex - 1;

        return {
          ...state,
          step: getLastProductStep(state.products[productIndex]),
          productIndex,
        };
      }
      return {
        ...state,
        step: CalculatorStep.Selection,
        questionIndex: QUESTION_INDEX.ProductSelection,
        productIndex: DEFAULT_PRODUCT_INDEX,
      };
    case "startLoading":
      return { ...state, step: CalculatorStep.Loading };
    case "calculationSucceeded":
      return {
        ...state,
        step: CalculatorStep.Result,
        calculationResponse: action.response,
        reduceImpact: getInitialReduceImpactState(action.response),
      };
    case "calculationFailed":
      return {
        ...state,
        step: CalculatorStep.Error,
        calculationError: action.error,
      };
    case "selectReplacementProduct": {
      const occurrencePerYear =
        state.calculationResponse?.consoPerProduct[action.productKey]
          ?.occurrencePerYear ?? null;

      return {
        ...state,
        reduceImpact: {
          ...state.reduceImpact,
          activeAccordionIndex: 1,
          selectedProductKey: action.productKey,
          replacementFrequencyPerYear: occurrencePerYear,
        },
      };
    }
    case "setReplacementFrequency":
      return {
        ...state,
        reduceImpact: {
          ...state.reduceImpact,
          replacementFrequencyPerYear: action.occurrencePerYear,
        },
      };
    case "confirmReplacementFrequency":
      return {
        ...state,
        reduceImpact: { ...state.reduceImpact, activeAccordionIndex: 2 },
      };
    case "selectAlternative":
      return {
        ...state,
        reduceImpact: {
          ...state.reduceImpact,
          selectedAlternative: action.alternative,
        },
      };
    case "setActiveAccordionIndex":
      return {
        ...state,
        reduceImpact: {
          ...state.reduceImpact,
          activeAccordionIndex: action.index,
        },
      };
    case "reset":
      return INITIAL_CALCULATOR_STATE;
    default:
      return state;
  }
};

export const isCurrentStepAnswered = (state: CalculatorState) => {
  if (state.step === CalculatorStep.Selection) {
    return state.products.length > 0;
  }
  if (state.step === CalculatorStep.Frequency) {
    return Boolean(state.products[state.productIndex]?.frequency);
  }
  if (state.step === CalculatorStep.Variant) {
    return true;
  }
  return false;
};

export const isCalculationResponseReady = (state: CalculatorState) =>
  state.calculationResponse !== null;

export const normalizeOccurrence = (value: string) => {
  const occurrence = Number.parseInt(value, 10);
  return Number.isNaN(occurrence)
    ? EMPTY_OCCURRENCE
    : Math.max(EMPTY_OCCURRENCE, occurrence);
};
