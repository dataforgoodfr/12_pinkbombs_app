import type { UserProductConsumption } from "./types";

export interface CalculatorSubmission {
  products: UserProductConsumption[];
}

export interface CalculatorSubmissionResponse {
  result: null;
}

export type CalculatorSubmissionService = (
  submission: CalculatorSubmission,
) => Promise<CalculatorSubmissionResponse>;

export const submitCalculatorMock: CalculatorSubmissionService = async () => ({
  result: null,
});
