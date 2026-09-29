import type {
  ImpactLevel,
  ProductConsumptionEntry,
} from "./computeConsumption";
import type { UserProductConsumption } from "./types";

export interface ReducedImpactSubmissionOptions {
  selectedProductKey: string;
  replacementFrequencyPerYear: number;
}

export interface CalculatorSubmission {
  products: UserProductConsumption[];
}

export const buildReducedImpactProducts = (
  products: UserProductConsumption[],
  {
    selectedProductKey,
    replacementFrequencyPerYear,
  }: ReducedImpactSubmissionOptions,
): UserProductConsumption[] => {
  const productIndex = products.findIndex((product) =>
    product.variants.length > 0
      ? product.variants.some((variant) => variant.type === selectedProductKey)
      : product.name === selectedProductKey,
  );

  if (productIndex === -1) {
    return products;
  }

  const selectedProduct = products[productIndex];
  const replacementProduct: UserProductConsumption = {
    ...selectedProduct,
    frequency: "otherYearly",
    frequencyLabel: "times per year",
    occurrence: replacementFrequencyPerYear,
    variants:
      selectedProduct.variants.length > 0
        ? selectedProduct.variants.filter(
            (variant) => variant.type === selectedProductKey,
          )
        : [],
  };

  if (selectedProduct.variants.length === 0) {
    return products.map((product, index) =>
      index === productIndex ? replacementProduct : { ...product },
    );
  }

  const remainingVariants = selectedProduct.variants.filter(
    (variant) => variant.type !== selectedProductKey,
  );
  const replacementProducts = remainingVariants.length
    ? [
        {
          ...selectedProduct,
          variants: remainingVariants,
        },
        replacementProduct,
      ]
    : [replacementProduct];

  return [
    ...products.slice(0, productIndex).map((product) => ({ ...product })),
    ...replacementProducts,
    ...products.slice(productIndex + 1).map((product) => ({ ...product })),
  ];
};

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
