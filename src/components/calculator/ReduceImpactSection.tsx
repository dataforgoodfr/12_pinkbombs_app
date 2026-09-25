"use client";

import { useTranslations } from "next-intl";

import { AccordionItem } from "./AccordionItem";
import { createDisplayLabelLookup } from "./getDisplayLabel";
import { normalizeOccurrence } from "./state";
import type { CalculatorSubmissionResponse } from "./submission";
import type { Question, ReduceImpactState } from "./types";

const frequencyInputClassName = `
  w-12 p-1 border-0 border-b-2 border-dotted border-v2-pink bg-v2-blue
  caret-v2-magenta text-v2-magenta text-center placeholder-v2-pink/50
  hover:ring-v2-magenta focus:ring-none focus:border-none focus:outline-none
  focus:text-v2-pink
`;

const ALTERNATIVES: { key: string; disabled?: boolean }[] = [
  { key: "algae" },
  { key: "plantBasedSmokedSalmon" },
  { key: "shellfish" },
  { key: "plantBasedProtein" },
  { key: "trout", disabled: true },
  { key: "tuna", disabled: true },
];

interface ReduceImpactSectionProps {
  questions: Question[];
  response: CalculatorSubmissionResponse;
  reduceImpact: ReduceImpactState;
  onSelectProduct: (productKey: string) => void;
  onFrequencyChange: (occurrencePerYear: number) => void;
  onConfirmFrequency: () => void;
  onSelectAlternative: (alternative: string) => void;
  onSetActiveAccordion: (index: 0 | 1 | 2) => void;
}

export const ReduceImpactSection = ({
  questions,
  response,
  reduceImpact,
  onSelectProduct,
  onFrequencyChange,
  onConfirmFrequency,
  onSelectAlternative,
  onSetActiveAccordion,
}: ReduceImpactSectionProps) => {
  const t = useTranslations("site.calculator");
  const getDisplayLabel = createDisplayLabelLookup(questions);

  const selectedEntry = reduceImpact.selectedProductKey
    ? response.consoPerProduct[reduceImpact.selectedProductKey]
    : undefined;
  const maxFrequency = selectedEntry?.occurrencePerYear ?? 1;
  const frequency = reduceImpact.replacementFrequencyPerYear ?? maxFrequency;

  return (
    <div className="flex flex-col gap-8">
      <h3 className="h3 text-pretty text-v2-pink text-center lg:text-left">
        {t("reduceImpact.title")}
      </h3>

      <div className="flex flex-col gap-4">
        <AccordionItem
          title={t("reduceImpact.step1.title")}
          isActive={reduceImpact.activeAccordionIndex === 0}
          onClick={() => onSetActiveAccordion(0)}
        >
          <div className="flex flex-col gap-2">
            {Object.entries(response.consoPerProduct).map(([key, entry]) => (
              <label
                key={key}
                className="cursor-pointer flex items-center gap-4"
              >
                <input
                  id={`replacement-product-${key}`}
                  name="replacement-product"
                  type="radio"
                  checked={reduceImpact.selectedProductKey === key}
                  onChange={() => onSelectProduct(key)}
                  className="
                    cursor-pointer appearance-none w-6 h-6 p-1 rounded-full
                    border border-v2-magenta bg-v2-pink checked:bg-v2-magenta
                    checked:ring-v2-magenta hover:ring-v2-magenta hover:bg-v2-magenta
                    focus:ring focus:ring-v2-magenta focus:ring-offset-v2-pink
                    focus:bg-v2-magenta focus:text-v2-magenta"
                />
                <span className="p-lead text-v2-pink">
                  {getDisplayLabel(key).charAt(0).toUpperCase() +
                    getDisplayLabel(key).slice(1)}{" "}
                  ({Math.round(entry.weightInKg)}kgs)
                </span>
              </label>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem
          title={t("reduceImpact.step2.title")}
          isActive={reduceImpact.activeAccordionIndex === 1}
          onClick={() => onSetActiveAccordion(1)}
        >
          <div className="flex flex-col gap-4">
            <label className="flex gap-2 items-end">
              <input
                id="replacement-frequency"
                name="replacement-frequency"
                type="number"
                min={1}
                max={maxFrequency}
                value={frequency}
                onChange={(event) =>
                  onFrequencyChange(
                    Math.min(
                      maxFrequency,
                      Math.max(1, normalizeOccurrence(event.target.value)),
                    ),
                  )
                }
                className={frequencyInputClassName}
              />
              <span className="p-lead text-v2-pink">
                {t("reduceImpact.step2.suffix")}
              </span>
            </label>
            <button
              type="button"
              onClick={onConfirmFrequency}
              className="inline-flex cta border-2 rounded-xl pointer-events-auto border-v2-blue hover:border-v2-pink hover:bg-v2-blue hover:text-v2-pink px-8 cursor-pointer text-v2-blue bg-v2-pink px-4 py-2 text-sm w-fit"
            >
              {t("reduceImpact.step2.confirm")}
            </button>
          </div>
        </AccordionItem>

        <AccordionItem
          title={t("reduceImpact.step3.title")}
          isActive={reduceImpact.activeAccordionIndex === 2}
          onClick={() => onSetActiveAccordion(2)}
        >
          <div className="flex flex-col gap-2">
            {ALTERNATIVES.map(({ key, disabled }) => (
              <label
                key={key}
                className={`flex items-center gap-4 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <input
                  id={`alternative-${key}`}
                  name="alternative"
                  type="radio"
                  disabled={disabled}
                  checked={reduceImpact.selectedAlternative === key}
                  onChange={() => onSelectAlternative(key)}
                  className="
                  cursor-pointer appearance-none w-6 h-6 p-1 rounded-full
                  border border-v2-magenta bg-v2-pink checked:bg-v2-magenta
                  checked:ring-v2-magenta hover:ring-v2-magenta hover:bg-v2-magenta
                  focus:ring focus:ring-v2-magenta focus:ring-offset-v2-pink
                  focus:bg-v2-magenta focus:text-v2-magenta
                  disabled:cursor-not-allowed disabled:hover:bg-v2-pink"
                />
                <span className="p-lead text-v2-pink">
                  {t(`reduceImpact.alternatives.${key}`)}
                </span>
                {disabled && (
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full border border-v2-pink text-v2-pink">
                    {t("reduceImpact.falseFriend")}
                  </span>
                )}
              </label>
            ))}
          </div>
        </AccordionItem>
      </div>
    </div>
  );
};
