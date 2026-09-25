import type {
  ImpactLevel,
  ProductConsumptionEntry,
} from "./computeConsumption";
import type { UserProductConsumption } from "./types";

export interface CalculatorSubmission {
  products: UserProductConsumption[];
}

export interface CalculatorSubmissionResponse {
  totalConsoInKg: number;
  consoPerProduct: Record<string, ProductConsumptionEntry>;
  impact: ImpactLevel;
}

export type CalculatorSubmissionService = (
  submission: CalculatorSubmission,
) => Promise<CalculatorSubmissionResponse | string>;

export const submitProductToCalculator: CalculatorSubmissionService = async ({
  products,
}) => {
  try {
    const response = await fetch("/api/calculator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products,
      }),
    });

    if (!response.ok) {
      return "Submission failed";
    }
    return (await response.json()) as CalculatorSubmissionResponse;
  } catch (error) {
    return (error as Error).message;
  }
};
