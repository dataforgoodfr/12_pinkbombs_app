"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type {
  CalculatorSubmissionResponse,
  CalculatorSubmissionService,
} from "@/lib/calculator/submission";
import type {
  Question,
  ReduceImpactState,
  UserProductConsumption,
} from "@/lib/calculator/types";

import { ReduceImpactSection } from "./ReduceImpactSection";
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
        <div className="flex flex-col lg:hidden gap-10">
          <h3 className="h3 flex justify-center items-center text-pretty text-v2-pink text-center gap-2">
            {t("result.title", { impact: impact?.text ?? response.impact })}
            <span
              className={`p-2 ${impact?.label === "veryHigh" ? "text-v2-red bg-black" : `text-black bg-v2-${impact?.color}`}`}
            >
              {impact?.text ?? response.impact}
            </span>
          </h3>
          <Calculator label={response.impact} />
          <p className="p-lead px-10 text-pretty text-v2-pink text-center">
            {t("result.caption", {
              totalConsoInKg: response.totalConsoInKg.toFixed(1),
            })}
          </p>
        </div>
        <div className="hidden lg:flex xl:grid grid-cols-2 gap-6 p-12 2xl:w-[60%] mx-auto">
          <div className="flex flex-col gap-6 mx-auto">
            <h3 className="h3 flex-inline justify-center text-pretty text-v2-pink text-left gap-4">
              {t("result.title", { impact: impact?.text ?? response.impact })}
              <span
                className={`ml-2 p-2 ${impact?.label === "veryHigh" ? "text-v2-red bg-black" : `text-black bg-v2-${impact?.color}`}`}
              >
                {impact?.text ?? response.impact}
              </span>
            </h3>
            <p className="p-lead text-pretty text-v2-pink text-center lg:text-left">
              {t("result.caption", {
                totalConsoInKg: response.totalConsoInKg.toFixed(1),
              })}
            </p>
          </div>
          <Calculator label={response.impact} />
        </div>
        <Image
          loading="lazy"
          src="/site/images/calculator/divider-reduce-impact-section.svg"
          width={1278}
          height={0}
          alt="Divider"
          className="hidden md:block h-auto w-full object-cover px-20"
        />
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
