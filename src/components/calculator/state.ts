import {
  DEFAULT_PRODUCT_INDEX,
  EMPTY_OCCURRENCE,
  MIN_VARIANT_COUNT,
  QUESTION_INDEX,
} from "./constants";
import {
  type CalculatorState,
  CalculatorStep,
  type UserProductConsumption,
} from "./types";

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  step: CalculatorStep.Selection,
  questionIndex: QUESTION_INDEX.ProductSelection,
  productIndex: DEFAULT_PRODUCT_INDEX,
  products: [],
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

export const normalizeOccurrence = (value: string) => {
  const occurrence = Number.parseInt(value, 10);
  return Number.isNaN(occurrence)
    ? EMPTY_OCCURRENCE
    : Math.max(EMPTY_OCCURRENCE, occurrence);
};
