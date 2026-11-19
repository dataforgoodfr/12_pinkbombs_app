"use client";

import * as React from "react";

import { normalizeOccurrence } from "@/lib/calculator/state";
import type {
  QuestionOption,
  SubQuestion,
  UserProductConsumption,
} from "@/lib/calculator/types";

interface FrequencyQuestionProps {
  product: UserProductConsumption;
  options: QuestionOption[];
  subQuestions?: SubQuestion[];
  mode: "frequency" | "variant";
  onFrequencyChange: (
    frequency: string | undefined,
    frequencyLabel?: string,
    occurrence?: number,
    advanceToVariant?: boolean,
  ) => void;
  onVariantChange: (variantType: string, count: number) => void;
}

const frequencyInputClassName = `
  w-12 p-1 border-0 border-b-2 border-dotted border-v2-pink bg-v2-blue
  caret-v2-magenta text-v2-magenta text-center placeholder-v2-pink/50
  hover:ring-v2-magenta focus:ring-none focus:border-none focus:outline-none
  focus:text-v2-pink
`;

const getFrequencyLabel = (label: string | undefined, occurrence: number | undefined): string => {
  if (!label) return "";
  // Handle Spanish pluralization: "veces" → "vez" for singular (occurrence = 1 only)
  if (occurrence === 1) {
    // Replace "veces" with "vez" explicitly for Spanish
    return label.startsWith("veces ") 
      ? "vez " + label.slice(6) 
      : label.replace(/veces/g, "vez");
  }
  return label;
};

export const FrequencyQuestion = ({
  product,
  options,
  subQuestions,
  mode,
  onFrequencyChange,
  onVariantChange,
}: FrequencyQuestionProps) => {
  const [customFrequency, setCustomFrequency] = React.useState<
    "weekly" | "yearly" | null
  >(
    product.frequency === "otherYearly"
      ? "yearly"
      : product.frequency === "otherWeekly"
        ? "weekly"
        : null,
  );
  const [customWeeklyValue, setCustomWeeklyValue] = React.useState<number | undefined>(
    product.frequency === "otherWeekly" ? product.occurrence : undefined
  );
  const [customYearlyValue, setCustomYearlyValue] = React.useState<number | undefined>(
    product.frequency === "otherYearly" ? product.occurrence : undefined
  );

  React.useEffect(() => {
    if (product.frequency === "otherWeekly") {
      setCustomWeeklyValue(product.occurrence);
    } else if (product.frequency === "otherYearly") {
      setCustomYearlyValue(product.occurrence);
    }
  }, [product.occurrence, product.frequency]);

  const selectFrequency = (option: QuestionOption) => {
    setCustomFrequency(null);
    onFrequencyChange(option.name, option.label, undefined, true);
  };

  const customOption = options.find(({ name }) => name === "otherFrequency");
  const customChoices = customOption?.options ?? [];
  const variantQuestion = subQuestions?.find(
    ({ name }) => name === product.name,
  );

  return (
    <div className="flex flex-col md:mx-auto gap-4">
      {mode === "frequency" &&
        options.map((option) => {
          if (option.name === "otherFrequency") {
            return (
              <div key={option.name}>
                <p className="p-lead text-v2-pink">{option.label}</p>
                <div className="flex row">
                  <div className="inline-flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-end">
                      <input
                        id="custom-frequency-weekly"
                        name="custom-frequency"
                        type="number"
                        min="0"
                        aria-label={`${customOption?.label ?? ""} ${getFrequencyLabel(customChoices[0]?.label, customFrequency === "weekly" ? (customWeeklyValue ?? 0) : 0)}`.trim()}
                        placeholder="0"
                        value={
                          customFrequency === "weekly"
                            ? customWeeklyValue ?? ""
                            : ""
                        }
                        onFocus={() => {
                          setCustomFrequency("weekly");
                          onFrequencyChange(undefined);
                        }}
                        onChange={(event) => {
                          const normalized = normalizeOccurrence(event.target.value);
                          setCustomWeeklyValue(normalized);
                          onFrequencyChange(
                            customChoices[0]?.name,
                            customChoices[0]?.label,
                            normalized,
                          );
                        }}
                        className={`${frequencyInputClassName} ${customFrequency === "yearly" ? "hidden" : "block"}`}
                      />
                      <span
                        className={`${customFrequency === "yearly" ? "hidden" : "block"} p-lead text-v2-pink`}
                      >
                        {getFrequencyLabel(customChoices[0]?.label, customFrequency === "weekly" ? customWeeklyValue : undefined)}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2 items-end">
                      <input
                        id="custom-frequency-yearly"
                        name="custom-frequency"
                        type="number"
                        min="0"
                        aria-label={`${customOption?.label ?? ""} ${getFrequencyLabel(customChoices[1]?.label, customFrequency === "yearly" ? (customYearlyValue ?? 0) : 0)}`.trim()}
                        placeholder="0"
                        value={
                          customFrequency === "yearly"
                            ? customYearlyValue ?? ""
                            : ""
                        }
                        onFocus={() => {
                          setCustomFrequency("yearly");
                          onFrequencyChange(undefined);
                        }}
                        onChange={(event) => {
                          const normalized = normalizeOccurrence(event.target.value);
                          setCustomYearlyValue(normalized);
                          onFrequencyChange(
                            customChoices[1]?.name,
                            customChoices[1]?.label,
                            normalized,
                          );
                        }}
                        className={`${frequencyInputClassName} ${customFrequency === "weekly" ? "hidden" : "block"}`}
                      />
                      <span
                        className={`${customFrequency === "weekly" ? "hidden" : "block"} p-lead text-v2-pink`}
                      >
                        {getFrequencyLabel(customChoices[1]?.label, customFrequency === "yearly" ? customYearlyValue : undefined)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <label
              key={option.name}
              className="cursor-pointer flex items-center gap-4"
            >
              <input
                id={`frequency-${option.name}`}
                name="frequency"
                type="radio"
                checked={product.frequency === option.name}
                onChange={() => selectFrequency(option)}
                className="
                cursor-pointer appearance-none w-6 h-6 p-1 rounded-full
                border border-v2-magenta bg-v2-pink checked:bg-v2-magenta
                checked:ring-v2-magenta hover:ring-v2-magenta hover:bg-v2-magenta
                focus:ring focus:ring-v2-magenta focus:ring-offset-v2-pink
                focus:bg-v2-magenta focus:text-v2-magenta"
              />
              <span className="p-lead text-v2-pink">
                {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
              </span>
            </label>
          );
        })}

      {mode === "variant" && variantQuestion && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            {variantQuestion.options.map((option) => {
              const count =
                product.variants.find(({ type }) => type === option.name)
                  ?.count ??
                option.defaultValue ??
                0;
              return (
                <label key={option.name} className="flex gap-2 items-end">
                  <input
                    id={`variant-${option.name}`}
                    name={product.name}
                    type="number"
                    min="0"
                    value={count}
                    onChange={(event) =>
                      onVariantChange(
                        option.name,
                        normalizeOccurrence(event.target.value),
                      )
                    }
                    className={frequencyInputClassName}
                  />
                  <span className="p-lead text-v2-pink inline-block">
                    {option.label}
                    {count > 1 ? "s" : ""}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
