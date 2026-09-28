"use client";

import { useTranslations } from "next-intl";

import type { ImpactLabel } from "./ResultScreen";
import type { CalculatorSubmissionResponse } from "./submission";
import Calculator from "../v2/Calculator";

interface DesktopImpactPanelProps {
  response: CalculatorSubmissionResponse;
  newResponse: CalculatorSubmissionResponse | null;
  selectedProductLabel: string;
  oldFrequency: number;
  newFrequency: number;
  selectedAlternative: string | null;
  selectedSupplement: string | null;
  onConfirmEngagements: () => void;
}

export const DesktopImpactPanel = ({
  response,
  newResponse,
  selectedProductLabel,
  oldFrequency,
  newFrequency,
  selectedAlternative,
  selectedSupplement,
  onConfirmEngagements,
}: DesktopImpactPanelProps) => {
  const t = useTranslations("site.calculator");
  const tComponents = useTranslations("site.components.calculator");
  const impactLabels = tComponents.raw("labels") as ImpactLabel[];
  const displayedResponse = newResponse ?? response;
  const oldImpact = impactLabels.find(({ label }) => label === response.impact);
  const newImpact = newResponse
    ? impactLabels.find(({ label }) => label === newResponse.impact)
    : null;
  const impact = impactLabels.find(
    ({ label }) => label === displayedResponse.impact,
  );

  return (
    <aside className="hidden lg:flex min-w-0 w-full flex-col gap-8 overflow-hidden rounded-xl bg-v2-pink p-6 text-v2-blue">
      <div className="flex flex-col gap-4">
        {newResponse ? (
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-v2-blue">
              <span className="p-lead">{t("newImpact.title")}:</span>{" "}
              {oldImpact?.text ?? response.impact} →{" "}
              <span className="p-lead">
                {newImpact?.text ?? newResponse.impact}
              </span>
            </p>
            <h3
              className={`h3 mr-auto p-2 ${newImpact?.label === "veryHigh" ? "bg-black text-v2-red" : `bg-v2-${newImpact?.color} text-black`}`}
            >
              {newImpact?.text ?? newResponse.impact}
            </h3>
          </div>
        ) : (
          <>
            <p className="p-lead">{t("result.title")}</p>
            <h3 className="h3">{impact?.text ?? displayedResponse.impact}</h3>
          </>
        )}
        <div className="flex w-full justify-center overflow-hidden pt-10">
          <Calculator
            label={displayedResponse.impact}
            className="origin-top scale-[0.68] -mb-10"
          />
        </div>
      </div>

      {newResponse && (
        <div className="flex flex-col gap-4">
          <p className="p-lead">{t("engagements.title")}</p>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-white p-4">
              <p className="p-caption">{t("engagements.dish")}</p>
              <p className="h4">{selectedProductLabel}</p>
              <p className="p-caption pt-1">
                {oldFrequency} {t("engagements.timesPerYear")} → {newFrequency}{" "}
                {t("engagements.timesPerYear")}
              </p>
            </div>
            {selectedAlternative && (
              <div className="rounded-xl bg-white p-4">
                <p className="p-caption">{t("engagements.alternative")}</p>
                <p className="h4">
                  {t(`reduceImpact.step3.alternatives.${selectedAlternative}`)}
                </p>
              </div>
            )}
            {selectedSupplement && (
              <div className="rounded-xl bg-white p-4">
                <p className="p-caption">{t("engagements.supplement")}</p>
                <p className="h4">
                  {t(`reduceImpact.step4.alternatives.${selectedSupplement}`)}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onConfirmEngagements}
            className="inline-flex cta border-2 rounded-xl border-v2-blue bg-v2-blue text-v2-pink hover:bg-black px-8 py-2 text-sm w-fit self-center cursor-pointer"
          >
            {t("engagements.confirm")}
          </button>
        </div>
      )}
    </aside>
  );
};
