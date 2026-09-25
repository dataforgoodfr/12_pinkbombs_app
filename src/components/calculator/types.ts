import type { CalculatorSubmissionResponse } from "./submission";

export interface QuestionOption {
  name: string;
  label: string;
  prefix?: string;
  placeholder?: string;
  defaultValue?: number;
  info?: string;
  options?: QuestionOption[];
}

export interface SubQuestion {
  name?: string;
  title: string;
  options: QuestionOption[];
}

export interface Question {
  title: string;
  type?: "checkbox" | "radio" | "text";
  options: QuestionOption[];
  subQuestions?: SubQuestion[];
}

export interface UserProductVariant {
  type: string;
  count: number;
}

export interface UserProductConsumption {
  name: string;
  label: string;
  prefix?: string;
  frequency?: string;
  frequencyLabel?: string;
  occurrence?: number;
  variants: UserProductVariant[];
  unit?: string;
}

export enum CalculatorStep {
  Selection = "selection",
  Frequency = "frequency",
  Variant = "variant",
  Summary = "summary",
  Loading = "loading",
  Result = "result",
  Error = "error",
}

export interface CalculatorState {
  step: CalculatorStep;
  questionIndex: number;
  productIndex: number;
  products: UserProductConsumption[];
  calculationResponse: CalculatorSubmissionResponse | null;
  calculationError: string | null;
}
