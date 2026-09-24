"use client";

import {
  CloseButton,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { FrequencyQuestion } from "./FrequencyQuestion";
import { LoadingScreen } from "./LoadingScreen";
import { ProductSelectionQuestion } from "./ProductSelectionQuestion";
import {
  type CalculatorSubmissionService,
  submitCalculatorMock,
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

export const CalculatorModal = ({
  open,
  questions,
  onClose,
  submissionService = submitCalculatorMock,
}: CalculatorModalProps) => {
  const t = useTranslations("site.calculator");
  const { state, dispatch, isNextButtonActive } = useCalculator();
  const currentProduct = state.products[state.productIndex];

  const reset = () => {
    dispatch({ type: "reset" });
    onClose();
  };

  const submit = async () => {
    dispatch({ type: "startLoading" });
    await submissionService({ products: state.products });
  };

  return (
    <Dialog open={open} onClose={reset} className="relative z-50">
      <div className="fixed inset-0 z-10 h-screen w-screen">
        <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative flex flex-col h-screen w-full px-3 pt-6 pb-10 gap-10 transform bg-v2-blue text-left transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div
              className={`flex shrink-0 px-4 ${state.step !== CalculatorStep.Selection ? "justify-between" : "justify-end"}`}
            >
              {state.step !== CalculatorStep.Selection && (
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => dispatch({ type: "back" })}
                  className="cursor-pointer text-v2-pink hover:text-v2-magenta text-end cta"
                >
                  <ArrowLeft />
                </button>
              )}
              <CloseButton
                onClick={reset}
                className="text-v2-pink hover:text-v2-magenta text-end tracking-wider text-md cta"
              >
                {t("modal.quit")}
              </CloseButton>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex min-h-full flex-col justify-center">
                {state.step === CalculatorStep.Summary && (
                  <SummaryScreen
                    products={state.products}
                    questions={questions}
                    onSubmit={submit}
                  />
                )}
                {state.step === CalculatorStep.Loading && <LoadingScreen />}
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
                      onClick={() => dispatch({ type: "next" })}
                    />
                  </div>
                )}
                {state.step === CalculatorStep.Frequency && currentProduct && (
                  <div className="flex flex-col justify-center items-center gap-8">
                    <div className="flex flex-col items-center px-6 gap-10 w-full">
                      <DialogTitle className="h4 lg:h2 text-center text-pretty text-v2-pink">
                        {t("modal.questions.1.title", {
                          prefix: currentProduct.prefix ?? "",
                          label: currentProduct.label,
                        })}
                      </DialogTitle>
                      <FrequencyQuestion
                        product={currentProduct}
                        options={questions[1]?.options ?? []}
                        subQuestions={questions[1]?.subQuestions}
                        onFrequencyChange={(
                          frequency,
                          frequencyLabel,
                          occurrence,
                        ) =>
                          dispatch({
                            type: "setFrequency",
                            productIndex: state.productIndex,
                            frequency,
                            frequencyLabel,
                            occurrence,
                          })
                        }
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
                      onClick={() => dispatch({ type: "next" })}
                    />
                  </div>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
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
