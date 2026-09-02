"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import Calculator from "@/components/v2/Calculator";
import Image from "next/image";
import {
  CloseButton,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ArrowLeft, CheckIcon } from "lucide-react";

interface QuestionOption {
  name: string;
  label: string;
  placeholder?: string;
  info?: string;
  options?: QuestionOption[];
}

interface SubQuestion extends Question {
  productName?: string;
}

interface Question {
  title: string;
  type?: "checkbox" | "radio" | "text";
  options: QuestionOption[];
  subQuestions?: SubQuestion[];
}

interface UserProductConsumption {
  productName?: string;
  frequency?: string;
  quantity?: string;
  unit?: string;
}

const CalculatorPage = () => {
  const t = useTranslations("site.calculator");
  const [isQuestionModalOpened, setIsQuestionModalOpened] =
    React.useState(false);
  const [isLoadingScreenDisplayed, setIsLoadingScreenDisplayed] =
    React.useState(false);
  const questions = t.raw("modal.questions") as Question[];
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedProducts, setSelectedProducts] = React.useState<
    UserProductConsumption[]
  >([]);
  const [isNextButtonActive, setIsNextButtonActive] = React.useState(false);

  React.useEffect(() => {
    const isCurrentQuestionAnswered = () => {
      if (currentQuestionIndex === 0) {
        return selectedProducts.length > 0;
      }
      return false;
    };

    setIsNextButtonActive(isCurrentQuestionAnswered());
  }, [currentQuestionIndex, selectedProducts, questions]);

  const handleNextClick = () => {
    console.log({ selectedProducts });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsLoadingScreenDisplayed(true);
    }
  };

  const saveData = (newProduct: UserProductConsumption) => {
    if (
      selectedProducts.some(
        (product) => product.productName === newProduct.productName,
      )
    ) {
      setSelectedProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.productName !== newProduct.productName,
        ),
      );
    } else {
      setSelectedProducts((prevProducts) => [...prevProducts, newProduct]);
    }
  };

  const handleOptionChange = (newProduct: UserProductConsumption) => {
    setSelectedProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return (
    <>
      <section className="bg-v2-pink text-v2-blue lg:px-0">
        <div className="relative flex flex-col justify-center gap-8 px-10 pt-20 lg:pt-48 pb-20">
          <Calculator label="medium" />
          <div className="z-30 flex flex-col gap-4 text-center">
            <h1 className="h1 text-pretty">{t("intro.title")}</h1>
            <p className="p-lead text-pretty lg:preserve-lines">
              {t("intro.caption")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsQuestionModalOpened(true)}
            className="inline-flex cta border-2 rounded-xl pointer-events-auto hover:scale-105 border-v2-blue px-8 mx-auto z-30 cursor-pointer text-v2-pink bg-v2-blue px-4 py-2 text-sm lg:text-base w-fit"
          >
            {t("intro.button")}
          </button>
        </div>
        <Image
          loading="lazy"
          src="/site/images/calculator/divider-footer.svg"
          width={1512}
          height={74}
          alt=""
          className="object-cover xl:w-[2000px]"
        />
      </section>
      <Dialog
        open={isQuestionModalOpened}
        onClose={setIsQuestionModalOpened}
        className="relative z-50"
      >
        <div className="fixed inset-0 z-10">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative flex flex-col min-h-screen w-full px-4 py-5 gap-10 transform overflow-hidden bg-v2-blue text-left transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div
                className={`flex ${currentQuestionIndex > 0 ? "justify-between" : "justify-end"}`}
              >
                {currentQuestionIndex > 0 && (
                  <ArrowLeft
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex - 1)
                    }
                    className="text-v2-pink text-end cta"
                  />
                )}
                <CloseButton
                  onClick={() => {
                    setIsNextButtonActive(false);
                    setIsQuestionModalOpened(false);
                    setCurrentQuestionIndex(0);
                    setIsLoadingScreenDisplayed(false);
                    setSelectedProducts([]);
                  }}
                  className="text-v2-pink text-end cta"
                >
                  {t("modal.quit")}
                </CloseButton>
              </div>
              {isLoadingScreenDisplayed ? (
                <div className="flex flex-col justify-center items-center gap-8">
                  <Image
                    loading="lazy"
                    src="/site/images/calculator/loading-fish.svg"
                    width={314}
                    height={173}
                    alt=""
                    className="object-cover"
                  />
                  <h2 className="h2 text-pretty text-v2-pink">
                    {t("loading.title")}
                  </h2>
                  <p className="p-lead text-v2-pink">{t("loading.caption")}</p>
                  <p className="p-caption italic text-v2-pink">
                    {t("loading.info")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-8">
                  <div className="flex flex-col justify-center gap-8">
                    {questions
                      .slice(currentQuestionIndex, currentQuestionIndex + 1)
                      .map((question, index) => (
                        <div
                          key={index}
                          className="flex flex-col h-full items-center px-6 gap-10"
                        >
                          <DialogTitle className="h3 lg:h2 text-center text-pretty text-v2-pink">
                            {question.title}
                          </DialogTitle>
                          <div className="flex flex-col w-full gap-4">
                            {question.options.map((option, optionIndex) => {
                              if (option.name === "otherSalmonType") {
                                return (
                                  <CalculatorTextInputBlock
                                    key={`key-question-${optionIndex + 1}`}
                                    questionOptionId={optionIndex}
                                    optionName={option.name}
                                    placeholder={option.label}
                                    saveData={(data) => {
                                      setIsNextButtonActive(
                                        data.productName !== undefined &&
                                          data.productName.trim() !== "",
                                      );
                                    }}
                                  />
                                );
                              }
                              if (question.type === "radio") {
                                return (
                                  <CalculatorRadioInputBlock
                                    key={`key-question-${optionIndex + 1}`}
                                    questionId={index}
                                    option={option}
                                    optionIndex={optionIndex}
                                    saveData={(data) => saveData(data)}
                                  />
                                );
                              }

                              return (
                                <CalculatorCheckboxInputBlock
                                  key={`key-question-${optionIndex + 1}`}
                                  questionId={index}
                                  option={option}
                                  optionIndex={optionIndex}
                                  selectedProducts={selectedProducts}
                                  saveData={(data) => {
                                    saveData(data);
                                  }}
                                  setIsNextButtonActive={setIsNextButtonActive}
                                  setSelectedProducts={setSelectedProducts}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      disabled={!isNextButtonActive}
                      onClick={() => handleNextClick()}
                      className={`pointer-events-auto inline-flex cta border-2 rounded-xl hover:scale-105 border-v2-blue text-v2-blue bg-v2-pink px-4 py-3 gap-4 ${!isNextButtonActive ? "opacity-50 cursor-not-allowed" : ""}`}
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
                      {t("modal.next")}
                    </button>
                  </div>
                </div>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

const CalculatorCheckboxInputBlock = ({
  questionId,
  option,
  optionIndex,
  selectedProducts,
  saveData,
  setSelectedProducts,
}: {
  questionId: number;
  option: QuestionOption;
  optionIndex: number;
  selectedProducts: any;
  setSelectedProducts: React.Dispatch<React.SetStateAction<any>>;
  saveData: (data: any) => void;
}) => {
  return (
    <label
      key={`label-${questionId}-option-${optionIndex + 1}`}
      className="flex items-center gap-4"
    >
      <input
        id={`question-${questionId}-option-${optionIndex + 1}`}
        key={`question-${questionId}-option-${optionIndex + 1}`}
        name={`question-${questionId}-option-${optionIndex + 1}`}
        onChange={(e) => {
          if (option.name === "none") {
            setSelectedProducts([]);
            saveData({ productName: "none"  });
            return;
          } else {
            setSelectedProducts(
              (prevProducts: UserProductConsumption[]) => [...prevProducts.filter((product: any) => product.productName !== "none")]
            );
          }
          saveData({ productName: option.name });
        }}
        checked={selectedProducts.find((product: any) => product.productName === option.name) ? true : false}
        type="checkbox"
        aria-describedby="offers-description"
        className="
          appearance-none
          w-6 h-6 p-1 
          rounded-full
          border border-v2-magenta 
          bg-v2-pink
          
          checked:bg-v2-magenta
          checked:ring-v2-magenta
          
          hover:ring-v2-magenta
          hover:bg-v2-magenta

          focus:ring 
          focus:ring-v2-magenta
          focus:ring-offset-v2-pink 
          focus:bg-v2-magenta
          focus:text-v2-magenta"
      />
      <span className="p-lead text-v2-pink">
        {capitalizeFirstLetter(option.label)}
      </span>
    </label>
  );
};

const CalculatorTextInputBlock = ({
  questionOptionId,
  optionName,
  placeholder,
  saveData,
}: {
  questionOptionId: number;
  optionName: string;
  placeholder: string;
  saveData: (data: any) => void;
}) => {
  return (
    <input
      id={`question-${questionOptionId + 1}`}
      key={`key-question-${questionOptionId + 1}`}
      name={optionName}
      onChange={() => {
        saveData({ productName: optionName });
        // if value is not empty, set isNextButtonActive to true, else set it to false
        const inputValue = (
          document.getElementById(
            `question-${questionOptionId + 1}`,
          ) as HTMLInputElement
        ).value;
        if (inputValue.trim() !== "") {
          saveData({ productName: inputValue });
        } else {
          saveData({ productName: undefined });
        }
      }}
      type="text"
      placeholder={placeholder}
      aria-describedby="offers-description"
      className="
        appearance-none
        w-full p-3 
        rounded-xl  
        border border-v2-magenta 
        bg-v2-pink
        caret-v2-blue

        placeholder-v2-blue/50
        
        hover:ring-v2-magenta

        focus:border-none
        focus:ring 
        focus:ring-v2-magenta
        focus:ring-offset-v2-pink
        focus:outline-v2-pink
        focus:text-v2-blue"
    />
  );
};

const CalculatorRadioInputBlock = ({
  questionId,
  option,
  optionIndex,
  saveData,
}: {
  questionId: number;
  option: QuestionOption;
  optionIndex: number;
  saveData: (data: any) => void;
}) => {
  return (
    <label key={`label-${questionId}`} className="flex items-center gap-4">
      <input
        id={`question-${questionId}-option-${optionIndex}`}
        key={`question-${questionId}`}
        name={`label-${questionId}`}
        onChange={() => {
          saveData({ productName: option.name });
        }}
        type="radio"
        aria-describedby="offers-description"
        className="
          appearance-none
          w-6 h-6 p-1 
          rounded-full
          border border-v2-magenta 
          bg-v2-pink
          
          checked:bg-v2-magenta
          checked:ring-v2-magenta
          
          hover:ring-v2-magenta
          hover:bg-v2-magenta

          focus:ring 
          focus:ring-v2-magenta
          focus:ring-offset-v2-pink 
          focus:bg-v2-magenta
          focus:text-v2-magenta"
      />
      <span className="p-lead text-v2-pink">
        {capitalizeFirstLetter(option.label)}
      </span>
    </label>
  );
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default CalculatorPage;
