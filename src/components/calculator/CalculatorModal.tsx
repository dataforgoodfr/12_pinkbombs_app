"use client";

import {
  CloseButton,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { ErrorScreen } from "./ErrorScreen";
import { FrequencyQuestion } from "./FrequencyQuestion";
import { LoadingScreen } from "./LoadingScreen";
import { ProductSelectionQuestion } from "./ProductSelectionQuestion";
import { ResultScreen } from "./ResultScreen";
import {
  type CalculatorSubmissionService,
  submitProductToCalculator,
} from "./submission";
import { SummaryScreen } from "./SummaryScreen";
import type { Question } from "./types";
import { CalculatorStep } from "./types";
import { useCalculator } from "./useCalculator";

interface CalculatorModalProps {
  open: boolean;
  questions: Question[];
  onClose: () => void;
  submissionService?: CalculatorSubmissionService;
}

type ScreenTransition = {
  axis: "x" | "y";
  direction: -1 | 0 | 1;
};

const MIN_LOADING_DURATION_MS = 3000;

const sleep = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

const screenVariants = {
  enter: ({
    axis,
    direction,
    reducedMotion,
  }: ScreenTransition & {
    reducedMotion: boolean;
  }) => ({
    opacity: 0,
    x: reducedMotion || axis === "y" ? 0 : direction * 80,
    y: reducedMotion || axis === "x" ? 0 : direction * 80,
  }),
  center: { opacity: 1, x: 0, y: 0 },
  exit: ({
    axis,
    direction,
    reducedMotion,
  }: ScreenTransition & {
    reducedMotion: boolean;
  }) => ({
    opacity: 0,
    x: reducedMotion || axis === "y" ? 0 : direction * -80,
    y: reducedMotion || axis === "x" ? 0 : direction * -80,
  }),
};

// Reveals the result screen sliding up from the bottom, regardless of the ambient screen transition
const resultVariants = {
  enter: ({ reducedMotion }: { reducedMotion: boolean }) => ({
    opacity: 0,
    y: reducedMotion ? 0 : 80,
  }),
  center: { opacity: 1, y: 0 },
  exit: ({ reducedMotion }: { reducedMotion: boolean }) => ({
    opacity: 0,
    y: reducedMotion ? 0 : 80,
  }),
};

export const CalculatorModal = ({
  open,
  questions,
  onClose,
  submissionService = submitProductToCalculator,
}: CalculatorModalProps) => {
  const t = useTranslations("site.calculator");
  const { state, dispatch, isNextButtonActive } = useCalculator();
  const reducedMotion = useReducedMotion() ?? false;
  const [screenTransition, setScreenTransition] =
    React.useState<ScreenTransition>({ axis: "x", direction: 0 });
  const currentProduct = state.products[state.productIndex];
  const currentVariantQuestion = questions[1]?.subQuestions?.find(
    ({ name }) => name === currentProduct?.name,
  );

  const reset = () => {
    setScreenTransition({ axis: "x", direction: 0 });
    dispatch({ type: "reset" });
    onClose();
  };

  const submit = async () => {
    setScreenTransition({ axis: "x", direction: 1 });
    dispatch({ type: "startLoading" });
    const [result] = await Promise.all([
      submissionService({ products: state.products }),
      sleep(MIN_LOADING_DURATION_MS),
    ]);

    if (typeof result === "string") {
      dispatch({ type: "calculationFailed", error: result });
      return;
    }

    dispatch({ type: "calculationSucceeded", response: result });
  };

  const next = () => {
    setScreenTransition({
      axis:
        state.step === CalculatorStep.Frequency &&
        Boolean(currentProduct?.variants.length)
          ? "y"
          : "x",
      direction: 1,
    });
    dispatch({ type: "next" });
  };

  const back = () => {
    setScreenTransition({
      axis: state.step === CalculatorStep.Variant ? "y" : "x",
      direction: -1,
    });
    dispatch({ type: "back" });
  };

  const retry = () => {
    setScreenTransition({ axis: "x", direction: -1 });
    dispatch({ type: "back" });
  };

  const screenKey = `${state.step}-${
    state.step === CalculatorStep.Frequency ||
    state.step === CalculatorStep.Variant
      ? state.productIndex
      : "screen"
  }`;
  const motionContext = { ...screenTransition, reducedMotion };
  const showProgress =
    state.step === CalculatorStep.Frequency ||
    state.step === CalculatorStep.Variant ||
    state.step === CalculatorStep.Summary;
  const completedProducts =
    state.step === CalculatorStep.Summary
      ? state.products.length
      : state.productIndex;

  return (
    <Dialog open={open} onClose={reset} className="relative z-50">
      <div className="fixed inset-0 z-10 h-screen w-screen">
        <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative flex flex-col h-screen w-full px-3 pt-6 pb-10 gap-10 transform bg-v2-blue text-left transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="grid shrink-0 grid-cols-2 items-center gap-y-3 px-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-4 sm:gap-y-0">
              {state.step !== CalculatorStep.Selection && (
                <button
                  type="button"
                  role="backbutton"
                  aria-label={t("modal.back")}
                  onClick={back}
                  className="col-start-1 row-start-1 justify-self-start cursor-pointer text-v2-pink hover:text-v2-magenta text-end cta"
                >
                  <ArrowLeft />
                </button>
              )}
              {showProgress && (
                <CalculatorProgress
                  completedProducts={completedProducts}
                  totalProducts={state.products.length}
                />
              )}
              <CloseButton
                onClick={reset}
                className="col-start-2 row-start-1 justify-self-end text-v2-pink hover:text-v2-magenta text-end tracking-wider text-md cta sm:col-start-3"
              >
                {t("modal.quit")}
              </CloseButton>
            </div>

            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
              <div className="flex min-h-full flex-col justify-center">
                <AnimatePresence
                  mode="wait"
                  initial={false}
                  custom={motionContext}
                >
                  <motion.div
                    key={screenKey}
                    custom={motionContext}
                    variants={
                      state.step === CalculatorStep.Result
                        ? resultVariants
                        : screenVariants
                    }
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: reducedMotion ? 0.12 : 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full"
                  >
                    {state.step === CalculatorStep.Summary && (
                      <SummaryScreen
                        products={state.products}
                        questions={questions}
                        onSubmit={submit}
                      />
                    )}
                    {state.step === CalculatorStep.Loading && <LoadingScreen />}
                    {state.step === CalculatorStep.Result &&
                      state.calculationResponse && (
                        <ResultScreen
                          questions={questions}
                          response={state.calculationResponse}
                          reduceImpact={state.reduceImpact}
                          onSelectProduct={(productKey) =>
                            dispatch({
                              type: "selectReplacementProduct",
                              productKey,
                            })
                          }
                          onFrequencyChange={(occurrencePerYear) =>
                            dispatch({
                              type: "setReplacementFrequency",
                              occurrencePerYear,
                            })
                          }
                          onConfirmFrequency={() =>
                            dispatch({ type: "confirmReplacementFrequency" })
                          }
                          onSelectAlternative={(alternative) =>
                            dispatch({ type: "selectAlternative", alternative })
                          }
                          onSetActiveAccordion={(index) =>
                            dispatch({ type: "setActiveAccordionIndex", index })
                          }
                        />
                      )}
                    {state.step === CalculatorStep.Error && (
                      <ErrorScreen onRetry={retry} />
                    )}
                    {state.step === CalculatorStep.Selection && (
                      <div className="flex flex-col justify-center items-center gap-8">
                        <div className="flex flex-col h-full items-center px-6 gap-10 w-full">
                          <DialogTitle className="h4 lg:h2 text-center text-pretty text-v2-pink">
                            {questions[0]?.title}
                          </DialogTitle>
                          <ProductSelectionQuestion
                            options={questions[0]?.options ?? []}
                            products={state.products}
                            onToggleProduct={(product) =>
                              dispatch({ type: "toggleProduct", product })
                            }
                          />
                        </div>
                        <NextButton
                          disabled={!isNextButtonActive}
                          onClick={next}
                        />
                      </div>
                    )}
                    {(state.step === CalculatorStep.Frequency ||
                      state.step === CalculatorStep.Variant) &&
                      currentProduct && (
                        <div className="flex flex-col justify-center items-center gap-8">
                          <div className="flex flex-col items-center px-6 gap-10 w-full">
                            <DialogTitle className="h4 lg:h2 text-center text-pretty text-v2-pink">
                              {state.step === CalculatorStep.Variant
                                ? currentVariantQuestion?.title
                                : t("modal.questions.1.title", {
                                    prefix: currentProduct.prefix ?? "",
                                    label: currentProduct.label,
                                  })}
                            </DialogTitle>
                            <FrequencyQuestion
                              product={currentProduct}
                              options={questions[1]?.options ?? []}
                              subQuestions={questions[1]?.subQuestions}
                              mode={
                                state.step === CalculatorStep.Variant
                                  ? "variant"
                                  : "frequency"
                              }
                              onFrequencyChange={(
                                frequency,
                                frequencyLabel,
                                occurrence,
                                advanceToVariant,
                              ) => {
                                if (
                                  advanceToVariant &&
                                  currentProduct.variants.length
                                ) {
                                  setScreenTransition({
                                    axis: "y",
                                    direction: 1,
                                  });
                                }

                                dispatch({
                                  type: "setFrequency",
                                  productIndex: state.productIndex,
                                  frequency,
                                  frequencyLabel,
                                  occurrence,
                                  advanceToVariant,
                                });
                              }}
                              onVariantChange={(variantType, count) =>
                                dispatch({
                                  type: "setVariantCount",
                                  productIndex: state.productIndex,
                                  variantType,
                                  count,
                                })
                              }
                            />
                          </div>
                          <NextButton
                            disabled={!isNextButtonActive}
                            onClick={next}
                          />
                        </div>
                      )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const CalculatorProgress = ({
  completedProducts,
  totalProducts,
}: {
  completedProducts: number;
  totalProducts: number;
}) => {
  const t = useTranslations("site.calculator");
  return (
    <div
      role="progressbar"
      aria-label={t("modal.progress")}
      aria-valuemin={0}
      aria-valuemax={totalProducts}
      aria-valuenow={completedProducts}
      aria-valuetext={t("modal.progressLabel", {
        completedProducts,
        totalProducts,
      })}
      className="col-span-2 row-start-2 flex items-center justify-center gap-2 justify-self-center sm:col-span-1 sm:col-start-2 sm:row-start-1"
    >
      {Array.from({ length: totalProducts }, (_, index) => {
        const completed = index < completedProducts;

        return (
          <svg
            key={index}
            width="14"
            height="13"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <ellipse
              cx="6.75"
              cy="6.5"
              rx="6.75"
              ry="6.5"
              fill={completed ? "#E82D04" : "white"}
            />
          </svg>
        );
      })}
    </div>
  );
};

const NextButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) => {
  const t = useTranslations("site.calculator");

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`pointer-events-auto inline-flex cta border-2 rounded-xl border-v2-blue text-v2-blue bg-v2-pink px-4 py-3 gap-4 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-v2-blue hover:text-v2-pink hover:border-v2-pink"}`}
    >
      <span aria-hidden="true">
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
      </span>
      {t("modal.next")}
    </button>
  );
};
