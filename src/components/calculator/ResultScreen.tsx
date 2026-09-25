"use client";

import { useTranslations } from "next-intl";

import type { CalculatorSubmissionResponse } from "./submission";
import type { Question } from "./types";
import Calculator from "../v2/Calculator";

interface ImpactLabel {
  label: string;
  text: string;
}

interface ResultScreenProps {
  questions: Question[];
  response: CalculatorSubmissionResponse;
}

export const ResultScreen = ({ questions, response }: ResultScreenProps) => {
  const t = useTranslations("site.calculator");
  const tComponents = useTranslations("site.components.calculator");
  const impactLabels = tComponents.raw("labels") as ImpactLabel[];
  const impactText =
    impactLabels.find(({ label }) => label === response.impact)?.text ??
    response.impact;

  const productOptions = questions[0]?.options ?? [];
  const variantOptions = (questions[1]?.subQuestions ?? []).flatMap(
    (subQuestion) => subQuestion.options,
  );

  const getDisplayLabel = (key: string): string =>
    productOptions.find(({ name }) => name === key)?.label ??
    variantOptions.find(({ name }) => name === key)?.label ??
    key;

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:items-center px-4 gap-12 lg:gap-24">
      <div className="flex flex-col gap-8 justify-center lg:justify-start">
        <h4 className="h4 text-pretty text-v2-pink text-center lg:text-left">
          {t("result.title", { impact: impactText })}
        </h4>
        <p className="p-lead text-pretty text-v2-pink text-center lg:text-left">
          {t("result.caption", {
            totalConsoInKg: response.totalConsoInKg.toFixed(1),
          })}
        </p>
        <div className="flex flex-col rounded-xl bg-v2-pink rotate-[3deg] divide-y-2 divide-black/5 py-6 px-4 text-black mx-auto lg:mx-0 lg:items-start lg:max-w-[50%]">
          {Object.entries(response.consoPerProduct).map(
            ([key, weightInKg]) => (
              <div key={key} className="flex justify-between gap-4 py-2">
                <p className="p-lead">{getDisplayLabel(key).charAt(0).toUpperCase() + getDisplayLabel(key).slice(1)}</p>
                <p className="p-lead">{weightInKg.toFixed(1)} kg</p>
              </div>
            ),
          )}
        </div>
      </div>
      <Calculator label={response.impact} />
    </div>
  );
};

