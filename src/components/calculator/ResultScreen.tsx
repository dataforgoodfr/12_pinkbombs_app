"use client";

import { useTranslations } from "next-intl";

import { ReduceImpactSection } from "./ReduceImpactSection";
import type {
  CalculatorSubmissionResponse,
  CalculatorSubmissionService,
} from "./submission";
import type {
  Question,
  ReduceImpactState,
  UserProductConsumption,
} from "./types";
import Calculator from "../v2/Calculator";

export interface ImpactLabel {
  label: string;
  text: string;
  color: string;
}

interface ResultScreenProps {
  questions: Question[];
  response: CalculatorSubmissionResponse;
  products: UserProductConsumption[];
  submissionService: CalculatorSubmissionService;
  reduceImpact: ReduceImpactState;
  onSelectProduct: (productKey: string) => void;
  onFrequencyChange: (occurrencePerYear: number) => void;
  onConfirmFrequency: () => void;
  onSelectAlternative: (alternative: string) => void;
  onSelectSupplement: (supplement: string) => void;
  onSetActiveAccordion: (index: 0 | 1 | 2 | 3 | null) => void;
}

export const ResultScreen = ({
  questions,
  response,
  products,
  submissionService,
  reduceImpact,
  onSelectProduct,
  onFrequencyChange,
  onConfirmFrequency,
  onSelectAlternative,
  onSelectSupplement,
  onSetActiveAccordion,
}: ResultScreenProps) => {
  const t = useTranslations("site.calculator");
  const tComponents = useTranslations("site.components.calculator");
  const impactLabels = tComponents.raw("labels") as ImpactLabel[];
  const impact = impactLabels.find(({ label }) => {
    if (label === response.impact) {
      return true;
    }
    return false;
  });
  return (
    <div className="min-h-0 flex-1 w-full overflow-x-hidden overflow-y-auto">
      <div className="flex min-h-full w-full flex-col justify-center gap-12">
        <h3 className="h3 flex justify-center items-center text-pretty text-v2-pink text-center lg:text-left gap-2">
          {t("result.title", { impact: impact?.text ?? response.impact })}
          <span className={`p-2 ${impact?.label === "veryHigh" ? "text-v2-red bg-black" : `text-black bg-v2-${impact?.color}`}`}>
            {impact?.text ?? response.impact}
          </span>
        </h3>
        <Calculator label={response.impact} />
        <p className="p-lead px-10 text-pretty text-v2-pink text-center lg:text-left">
          {t("result.caption", {
            totalConsoInKg: response.totalConsoInKg.toFixed(1),
          })}
        </p>
        <ReduceImpactSection
          questions={questions}
          response={response}
          products={products}
          submissionService={submissionService}
          reduceImpact={reduceImpact}
          onSelectProduct={onSelectProduct}
          onFrequencyChange={onFrequencyChange}
          onConfirmFrequency={onConfirmFrequency}
          onSelectAlternative={onSelectAlternative}
          onSelectSupplement={onSelectSupplement}
          onSetActiveAccordion={onSetActiveAccordion}
        />
      </div>
    </div>
  );
};
