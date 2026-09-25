"use client";

import { useTranslations } from "next-intl";

import { ReduceImpactSection } from "./ReduceImpactSection";
import type { CalculatorSubmissionResponse } from "./submission";
import type { Question, ReduceImpactState } from "./types";
import Calculator from "../v2/Calculator";

interface ImpactLabel {
  label: string;
  text: string;
}

interface ResultScreenProps {
  questions: Question[];
  response: CalculatorSubmissionResponse;
  reduceImpact: ReduceImpactState;
  onSelectProduct: (productKey: string) => void;
  onFrequencyChange: (occurrencePerYear: number) => void;
  onConfirmFrequency: () => void;
  onSelectAlternative: (alternative: string) => void;
  onSetActiveAccordion: (index: 0 | 1 | 2) => void;
}

export const ResultScreen = ({
  questions,
  response,
  reduceImpact,
  onSelectProduct,
  onFrequencyChange,
  onConfirmFrequency,
  onSelectAlternative,
  onSetActiveAccordion,
}: ResultScreenProps) => {
  const t = useTranslations("site.calculator");
  const tComponents = useTranslations("site.components.calculator");
  const impactLabels = tComponents.raw("labels") as ImpactLabel[];
  const impactText =
    impactLabels.find(({ label }) => label === response.impact)?.text ??
    response.impact;

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:items-center px-4 gap-12 lg:gap-24">
      <div className="flex flex-col gap-12 justify-center lg:justify-start">
        <h3 className="h3 text-pretty text-v2-pink text-center lg:text-left">
          {t("result.title", { impact: impactText })}
        </h3>
        <Calculator label={response.impact} />
        <p className="p-lead text-pretty text-v2-pink text-center lg:text-left">
          {t("result.caption", {
            totalConsoInKg: response.totalConsoInKg.toFixed(1),
          })}
        </p>
        <ReduceImpactSection
          questions={questions}
          response={response}
          reduceImpact={reduceImpact}
          onSelectProduct={onSelectProduct}
          onFrequencyChange={onFrequencyChange}
          onConfirmFrequency={onConfirmFrequency}
          onSelectAlternative={onSelectAlternative}
          onSetActiveAccordion={onSetActiveAccordion}
        />
      </div>
    </div>
  );
};
