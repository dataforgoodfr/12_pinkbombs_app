"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";

import type { ImpactLabel } from "@/components/calculator/ResultScreen";

import { AccordionItem } from "./AccordionItem";
import { AccordionRadio } from "./AccordionRadio";
import { DesktopImpactPanel } from "./DesktopImpactPanel";
import { createDisplayLabelLookup } from "./getDisplayLabel";
import { normalizeOccurrence } from "./state";
import {
  buildReducedImpactProducts,
  type CalculatorSubmissionResponse,
  type CalculatorSubmissionService,
} from "./submission";
import type {
  Question,
  ReduceImpactState,
  UserProductConsumption,
} from "./types";
import Calculator from "../v2/Calculator";
import { useIsMobile } from "@/hooks/useIsMobile";

const frequencyInputClassName = `
  w-12 p-1 border-0 border-b-2 border-dotted border-v2-pink bg-v2-blue
  caret-v2-magenta text-v2-magenta text-center placeholder-v2-pink/50
  hover:ring-v2-magenta focus:ring-none focus:border-none focus:outline-none
  focus:text-v2-pink
`;

const formatConsumptionWeight = (weightInKg: number) =>
  weightInKg >= 1
    ? `${weightInKg.toFixed(1)} kg`
    : `${Math.round(weightInKg * 1000)} g`;

const wait = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

const PRODUCT_SELECTION_DELAY_MS = 1500;

const STEP_3_ALTERNATIVES: { key: string; disabled?: boolean }[] = [
  { key: "algae" },
  { key: "plantBasedSmokedSalmon" },
  { key: "shellfish" },
  { key: "plantBasedProtein" },
  { key: "trout", disabled: true },
  { key: "tuna", disabled: true },
];

const STEP_4_ALTERNATIVES: { key: string; disabled?: boolean }[] = [
  { key: "flaxSeedOil" },
  { key: "chiaSeeds" },
  { key: "walnutOil" },
  { key: "rapeSeedOil" },
  { key: "nut" },
  { key: "algae" },
  { key: "fishOil", disabled: true },
];

interface ReduceImpactSectionProps {
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

export const ReduceImpactSection = ({
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
}: ReduceImpactSectionProps) => {
  const t = useTranslations("site.calculator");
  const isMobile = useIsMobile();
  const getDisplayLabel = createDisplayLabelLookup(questions);
  const [newResponse, setNewResponse] =
    React.useState<CalculatorSubmissionResponse | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [calculationError, setCalculationError] = React.useState<string | null>(
    null,
  );
  const [engagementsConfirmed, setEngagementsConfirmed] = React.useState(false);
  const [hasOmega3Consent, setHasOmega3Consent] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [badgeVisible, setBadgeVisible] = React.useState(false);
  const badgeQuestionsRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLDivElement>(null);
  const newResponseRef = React.useRef<HTMLDivElement>(null);
  const pendingProductTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const pendingAlternativeTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const pendingSupplementTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [pendingProductKey, setPendingProductKey] = React.useState<
    string | null
  >(null);
  const [pendingAlternative, setPendingAlternative] = React.useState<
    string | null
  >(null);
  const [pendingSupplement, setPendingSupplement] = React.useState<
    string | null
  >(null);
  const tComponents = useTranslations("site.components.calculator");
  const impactLabels = tComponents.raw("labels") as ImpactLabel[];
  const oldImpact = impactLabels.find(({ label }) => {
    if (label === response.impact) {
      return true;
    }
    return false;
  });
  const newImpact = impactLabels.find(({ label }) => {
    if (label === newResponse?.impact) {
      return true;
    }
    return false;
  });

  const selectedEntry = reduceImpact.selectedProductKey
    ? response.consoPerProduct[reduceImpact.selectedProductKey]
    : undefined;
  const maxFrequency = selectedEntry?.occurrencePerYear ?? 1;
  const frequency = reduceImpact.replacementFrequencyPerYear ?? maxFrequency;
  const selectedAlternative = reduceImpact.selectedAlternative;
  const selectedSupplement = reduceImpact.selectedSupplement;
  const canCalculate = Boolean(
    reduceImpact.selectedProductKey &&
      reduceImpact.replacementFrequencyPerYear !== null &&
      selectedAlternative &&
      selectedSupplement,
  );
  const selectedProductLabel = reduceImpact.selectedProductKey
    ? getDisplayLabel(reduceImpact.selectedProductKey)
    : "";
  const engagementDish = `${selectedProductLabel}`.trim();
  const engagementAlternative = selectedAlternative
    ? t(`engagements.alternatives.${selectedAlternative}`)
    : "";
  const engagementSupplement = selectedSupplement
    ? t(`engagements.supplements.${selectedSupplement}`)
    : "";
  const oldFrequency = selectedEntry?.occurrencePerYear ?? 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  React.useEffect(() => {
    if (newResponse && !isCalculating) {
      requestAnimationFrame(() => {
        newResponseRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [newResponse, isCalculating]);

  React.useEffect(() => {
    if (badgeVisible) {
      requestAnimationFrame(() => {
        badgeRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [badgeVisible]);

  React.useEffect(() => {
    if (engagementsConfirmed) {
      requestAnimationFrame(() => {
        badgeQuestionsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [engagementsConfirmed]);

  React.useEffect(
    () => () => {
      if (pendingProductTimeoutRef.current) {
        clearTimeout(pendingProductTimeoutRef.current);
      }
      if (pendingAlternativeTimeoutRef.current) {
        clearTimeout(pendingAlternativeTimeoutRef.current);
      }
      if (pendingSupplementTimeoutRef.current) {
        clearTimeout(pendingSupplementTimeoutRef.current);
      }
    },
    [],
  );

  const calculateReducedImpact = async () => {
    if (!reduceImpact.selectedProductKey) return;

    setIsCalculating(true);
    setCalculationError(null);
    setEngagementsConfirmed(false);
    setBadgeVisible(false);

    const [result] = await Promise.all([
      submissionService({
        products: buildReducedImpactProducts(products, {
          selectedProductKey: reduceImpact.selectedProductKey,
          replacementFrequencyPerYear: frequency,
        }),
      }),
      wait(1000),
    ]);

    if (typeof result === "string") {
      setCalculationError(result);
    } else {
      setNewResponse(result);
    }

    setIsCalculating(false);
  };

  const calculateNewImpact = async () => {
    if (!canCalculate) return;
    await calculateReducedImpact();
  };

  const confirmFrequency = () => {
    onConfirmFrequency();
    if (!isMobile) {
      void calculateReducedImpact();
    }
  };

  const confirmEngagements = () => {
    setEngagementsConfirmed(true);
  };

  const validateEmail = () => {
    if (email && !isEmailValid) {
      setEmailError(t("badgeQuestions.emailError"));
      return false;
    }

    setEmailError(null);
    return true;
  };

  const showBadge = () => {
    if (!validateEmail()) return;
    setBadgeVisible(true);
  };

  const selectProductWithDelay = (productKey: string) => {
    if (pendingProductTimeoutRef.current) {
      clearTimeout(pendingProductTimeoutRef.current);
    }

    setPendingProductKey(productKey);
    pendingProductTimeoutRef.current = setTimeout(() => {
      onSelectProduct(productKey);
      onSetActiveAccordion(1);
      pendingProductTimeoutRef.current = null;
      setPendingProductKey(null);
    }, PRODUCT_SELECTION_DELAY_MS);
  };

  const selectAlternativeWithDelay = (alternative: string) => {
    if (pendingAlternativeTimeoutRef.current) {
      clearTimeout(pendingAlternativeTimeoutRef.current);
    }

    setPendingAlternative(alternative);
    pendingAlternativeTimeoutRef.current = setTimeout(() => {
      onSelectAlternative(alternative);
      onSetActiveAccordion(3);
      pendingAlternativeTimeoutRef.current = null;
      setPendingAlternative(null);
    }, PRODUCT_SELECTION_DELAY_MS);
  };

  const selectSupplementWithDelay = (supplement: string) => {
    if (pendingSupplementTimeoutRef.current) {
      clearTimeout(pendingSupplementTimeoutRef.current);
    }

    setPendingSupplement(supplement);
    pendingSupplementTimeoutRef.current = setTimeout(() => {
      onSelectSupplement(supplement);
      onSetActiveAccordion(null);
      pendingSupplementTimeoutRef.current = null;
      setPendingSupplement(null);
    }, PRODUCT_SELECTION_DELAY_MS);
  };

  return (
    <div className="flex flex-col gap-8">
      <h3 className="h3 text-pretty text-v2-pink text-center lg:text-left lg:pl-12 xl:w-[80%] 2xl:w-[60%] mx-auto">
        {t("reduceImpact.title")}
      </h3>
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:pb-20 xl:w-[80%] 2xl:w-[60%] mx-auto">
        <div className="flex flex-col gap-4 px-4 md:px-12">
          <AccordionItem
            title={t("reduceImpact.step1.title")}
            isActive={reduceImpact.activeAccordionIndex === 0}
            onClick={() =>
              onSetActiveAccordion(
                reduceImpact.activeAccordionIndex === 0 ? null : 0,
              )
            }
          >
            <div className="flex flex-col gap-4">
              <p className="p-lead text-pretty text-v2-pink">
                {t("reduceImpact.step1.caption")}
              </p>
              <div className="p-4 flex flex-col gap-2">
                {Object.entries(response.consoPerProduct).map(([key, entry]) => (
                  <label
                    key={key}
                    className="cursor-pointer flex items-center gap-4"
                  >
                    <AccordionRadio
                      id={`replacement-product-${key}`}
                      name="replacement-product"
                      checked={
                        pendingProductKey !== null
                          ? pendingProductKey === key
                          : reduceImpact.selectedProductKey === key
                      }
                      onChange={() => selectProductWithDelay(key)}
                    />
                    <span className="p-lead text-v2-pink">
                      {getDisplayLabel(key).charAt(0).toUpperCase() +
                        getDisplayLabel(key).slice(1)}{" "}
                      ({formatConsumptionWeight(entry.weightInKg)}{" "}
                      {t("engagements.perYear")})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title={t("reduceImpact.step2.title")}
            isActive={reduceImpact.activeAccordionIndex === 1}
            onClick={() =>
              onSetActiveAccordion(
                reduceImpact.activeAccordionIndex === 1 ? null : 1,
              )
            }
          >
            <div className="flex flex-col gap-4">
              <p className="p-lead text-pretty text-v2-pink">
                {t("reduceImpact.step2.caption", {
                  frequency: `${response.consoPerProduct[reduceImpact.selectedProductKey ?? ""]?.occurrencePerYear ?? 1}`,
                })}
              </p>
              <label className="pl-2 flex gap-2 items-end">
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
                onClick={confirmFrequency}
                className="inline-flex cta border-2 rounded-xl pointer-events-auto border-v2-blue hover:border-v2-pink hover:bg-v2-blue hover:text-v2-pink px-8 cursor-pointer text-v2-blue bg-v2-pink px-4 py-2 text-sm w-fit"
              >
                {t("reduceImpact.step2.confirm")}
              </button>
            </div>
          </AccordionItem>

          <AccordionItem
            title={t("reduceImpact.step3.title")}
            isActive={reduceImpact.activeAccordionIndex === 2}
            onClick={() =>
              onSetActiveAccordion(
                reduceImpact.activeAccordionIndex === 2 ? null : 2,
              )
            }
          >
            <div className="p-4 flex flex-col gap-2">
              {STEP_3_ALTERNATIVES.map(({ key, disabled }) => (
                <label
                  key={key}
                  className={`flex items-center gap-4 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <AccordionRadio
                    id={`alternative-${key}`}
                    name="alternative"
                    disabled={disabled}
                    checked={
                      pendingAlternative !== null
                        ? pendingAlternative === key
                        : reduceImpact.selectedAlternative === key
                    }
                    onChange={() => selectAlternativeWithDelay(key)}
                  />
                  <span className="p-lead text-v2-pink">
                    {t(`reduceImpact.step3.alternatives.${key}`)}
                  </span>
                  {disabled && (
                    <span className="text-xs uppercase px-2 py-0.5 rounded-full border border-v2-pink text-v2-pink">
                      {t("reduceImpact.step3.falseFriend")}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem
            title={t("reduceImpact.step4.title")}
            isActive={reduceImpact.activeAccordionIndex === 3}
            onClick={() =>
              onSetActiveAccordion(
                reduceImpact.activeAccordionIndex === 3 ? null : 3,
              )
            }
          >
            <div className="p-4 flex flex-col gap-2">
              {STEP_4_ALTERNATIVES.map(({ key, disabled }) => (
                <label
                  key={key}
                  className={`flex items-center gap-4 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <AccordionRadio
                    id={`alternative-${key}`}
                    name="alternative"
                    disabled={disabled}
                    checked={
                      pendingSupplement !== null
                        ? pendingSupplement === key
                        : reduceImpact.selectedSupplement === key
                    }
                    onChange={() => selectSupplementWithDelay(key)}
                  />
                  <span className="p-lead text-v2-pink">
                    {t(`reduceImpact.step4.alternatives.${key}`)}
                  </span>
                  {disabled && (
                    <span className="text-xs uppercase px-2 py-0.5 rounded-full border border-v2-pink text-v2-pink">
                      {t("reduceImpact.step4.falseFriend")}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </AccordionItem>

          <button
            type="button"
            onClick={calculateNewImpact}
            disabled={!canCalculate || isCalculating}
            className="my-2 inline-flex lg:hidden cta border-2 rounded-xl pointer-events-auto border-v2-blue hover:border-v2-pink hover:bg-v2-blue hover:text-v2-pink px-8 cursor-pointer text-v2-blue bg-v2-pink py-2 text-sm w-fit self-center disabled:cursor-not-allowed disabled:opacity-50 text-pretty"
          >
            {isCalculating
              ? t("reduceImpact.recalculate.loading")
              : t("reduceImpact.recalculate.button")}
          </button>
          {calculationError && (
            <p role="alert" className="p-lead text-v2-pink text-center">
              {t("reduceImpact.recalculate.error")}
            </p>
          )}
        </div>
        {newResponse && (
          <div
            ref={newResponseRef}
            className="flex lg:hidden flex-col rounded-xl gap-8 bg-v2-pink p-6 m-4 md:mx-12 lg:p-10"
          >
            <div className="flex flex-col gap-2 mb-6">
              <p className="text-v2-blue">
                <span className="p-lead">{t("newImpact.title")}:</span>{" "}
                {oldImpact?.text ?? response.impact} →{" "}
                <span className="p-lead">
                  {newImpact?.text ?? newResponse.impact}
                </span>
              </p>
              <h3
                className={` h3 p-2 mr-auto ${newImpact?.label === "veryHigh" ? "text-v2-red bg-black" : `text-black bg-v2-${newImpact?.color}`}`}
              >
                {newImpact?.text ?? newResponse.impact}
              </h3>
            </div>
            <Calculator label={newResponse.impact} />
            <div className="flex flex-col gap-4">
              <p className="p-lead text-v2-blue">{t("engagements.title")}</p>
              <div className="flex flex-col gap-3">
                <div className="bg-white rounded-xl p-4 text-v2-blue">
                  <p className="p-lead">{t("engagements.dish")}</p>
                  <h4 className="h4 text-v2-blue">{selectedProductLabel}</h4>
                  <p className="p-caption md:pt-2">
                    {oldFrequency} {t("engagements.timesPerYear")} → {frequency}{" "}
                    {t("engagements.timesPerYear")}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 text-v2-blue">
                  <p className="p-lead">{t("engagements.alternative")}</p>
                  <h4 className="h4 text-v2-blue">
                    {selectedAlternative
                      ? t(
                          `reduceImpact.step3.alternatives.${selectedAlternative}`,
                        )
                      : ""}
                  </h4>
                </div>
                <div className="bg-white rounded-xl p-4 text-v2-blue">
                  <p className="p-lead">{t("engagements.supplement")}</p>
                  <h4 className="h4 text-v2-blue">
                    {selectedSupplement
                      ? t(`reduceImpact.step4.alternatives.${selectedSupplement}`)
                      : ""}
                  </h4>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={confirmEngagements}
              className="inline-flex cta border-2 rounded-xl border-v2-blue bg-v2-blue text-v2-pink hover:bg-black px-8 py-2 text-sm w-fit self-center text-v2-blue cursor-pointer"
            >
              {t("engagements.confirm")}
            </button>
          </div>
        )}
        <div className="pr-12">
          <DesktopImpactPanel
            response={response}
            newResponse={newResponse}
            selectedProductLabel={selectedProductLabel}
            oldFrequency={oldFrequency}
            newFrequency={frequency}
            selectedAlternative={selectedAlternative}
            selectedSupplement={selectedSupplement}
            onConfirmEngagements={confirmEngagements}
          />
        </div>
      </div>

      {newResponse && engagementsConfirmed && (
        <div className="w-full bg-v2-yellow text-v2-blue">
          <Image
            loading="lazy"
            src="/site/images/calculator/divider-badge.svg"
            width={1512}
            height={53}
            alt="Divider"
            className="block h-auto w-full object-cover"
          />
          <div className="relative grid place-items-center px-4 py-20 sm:px-6 sm:py-14 lg:px-8 lg:py-16 2xl:mt-52">
            <Image
              loading="lazy"
              src="/site/images/calculator/badges/fishes-left-block.svg"
              width={612}
              height={707}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-0 top-1/2 hidden h-auto w-[26%] max-w-[612px] -translate-y-1/2 xl:translate-y-0 xl:block"
            />
            <div
              ref={badgeQuestionsRef}
              className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-6 xl:mt-16 2xl:-mt-32"
            >
              <Image
                loading="lazy"
                src="/site/images/calculator/loading-fish.svg"
                width={314}
                height={173}
                alt=""
                className="object-cover mx-auto"
              />
              <h3 className="h4 mt-8 lg:mt-12 text-center text-v2-blue">
                {t("badgeQuestions.title")}
              </h3>
            <label className="flex items-start gap-3 p-lead">
              <input
                type="checkbox"
                checked={hasOmega3Consent}
                onChange={(event) => setHasOmega3Consent(event.target.checked)}
                className="
                  cursor-pointer appearance-none w-6 h-6 p-1
                  border border-v2-magenta bg-white checked:bg-v2-magenta
                  checked:ring-v2-magenta hover:ring-v2-magenta hover:bg-v2-magenta
                  focus:ring focus:ring-v2-magenta focus:ring-offset-v2-pink
                  focus:bg-v2-magenta focus:text-v2-magenta"
              />
              <span>{t("badgeQuestions.omega3Consent")}</span>
            </label>
            <label className="flex flex-col gap-3 p-lead">
              <span className="text-pretty">{t("badgeQuestions.emailCaption")}</span>
              <input
                id="email"
                name="email"
                type="email"
                aria-label={t("badgeQuestions.email")}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError(null);
                }}
                onBlur={validateEmail}
                placeholder={t("badgeQuestions.emailPlaceholder")}
                className="inline-block h-10 w-full border-0 rounded-xl bg-white px-4 py-2 text-xs text-v2-blue placeholder:text-gray-400 placeholder:text-xs lg:placeholder:text-sm focus:ring focus:ring-v2-magenta"
                suppressHydrationWarning
              />
            </label>
            {emailError && (
              <p role="alert" className="text-sm text-v2-red">
                {emailError}
              </p>
            )}

            <button
              type="button"
              onClick={showBadge}
              disabled={!!emailError}
              className="inline-flex items-center gap-4 cta border-2 rounded-xl bg-v2-pink border-v2-pink hover:bg-v2-pink text-v2-blue px-8 py-2 text-sm w-fit self-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.9849 10.6445L19.5327 12L17.9849 13.3545L8.38525 21.7539L6.01416 19.0449L14.0659 11.999L6.01416 4.9541L8.38525 2.24512L17.9849 10.6445Z"
                  fill="#E82D04"
                />
              </svg>
              {t("badgeQuestions.button")}
            </button>
            </div>
            <Image
              loading="lazy"
              src="/site/images/calculator/badges/fishes-right-block.svg"
              width={566}
              height={707}
              alt=""
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 hidden h-auto w-[26%] max-w-[566px] -translate-y-1/2 xl:translate-y-0 xl:block"
            />
          </div>
          {badgeVisible && (
            <div ref={badgeRef} className="flex flex-col lg:bg-v2-magenta py-10 xl:py-20 2xl:py-32 gap-8 xl:mt-10 2xl:mt-16">
              <h2 className="h2 text-center text-v2-blue">{t("badgeQuestions.unlockedBadge")}</h2>
              <div
                className="flex flex-col items-center gap-5 bg-white p-6 text-v2-blue rounded-xl mx-10 mb-10 py-20 px-6 md:px-12 lg:mx-auto lg:w-full lg:max-w-2xl"
              >
                <Image
                  src={`/site/images/calculator/badges/${newResponse.impact}.svg`}
                  alt={t(`badges.${newResponse.impact}.title`)}
                  width={640}
                  height={640}
                  className="h-auto w-full max-w-sm"
                />
                <h3 className="h3 text-center">
                  {t(`badges.${newResponse.impact}.title`)}
                </h3>
                <p className="p-lead text-center">
                  {t(`badges.${newResponse.impact}.caption`)}
                </p>
                <Image
                  loading="lazy"
                  src="/site/images/calculator/divider-engagement.svg"
                  width={460}
                  height={0}
                  alt="Divider"
                  className="object-cover w-[50%] mx-auto"
                />
                <h4 className="h4 text-center">
                  "
                  {t(
                    `engagements.${oldFrequency === frequency ? "impactEqual" : "impactChanged"}`,
                    {
                    newFrequency: frequency,
                    oldFrequency,
                    dish: engagementDish,
                    alternative: engagementAlternative,
                    supplement: engagementSupplement,
                    supplementAmount: 15,
                    },
                  )}
                  "
                </h4>
                <button
                  type="button"
                  onClick={() => {}}
                  className="inline-flex w-full md:w-0 justify-center mt-4 cta border-2 rounded-xl border-v2-blue bg-v2-blue text-v2-pink hover:bg-black hover:text-v2-pink px-8 md:px-16 py-2 text-sm w-fit  self-center cursor-pointer"
                >
                  {t("badgeQuestions.share")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
