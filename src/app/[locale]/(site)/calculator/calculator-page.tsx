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
  prefix?: string;
  placeholder?: string;
  info?: string;
  options?: QuestionOption[];
}

interface SubQuestion extends Question {
  name?: string;
}

interface Question {
  title: string;
  type?: "checkbox" | "radio" | "text";
  options: QuestionOption[];
  subQuestions?: SubQuestion[];
}

interface UserProductConsumption {
  name?: string;
  label?: string;
  prefix?: string;
  frequency?: string;
  count?: number;
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
  const [currentProductIndex, setCurrentProductIndex] = React.useState<number>(0);
  const [selectedProducts, setSelectedProducts] = React.useState<
    UserProductConsumption[]
  >([]);
  const [isFrequencyOtherWeeklyDisplayed, setIsFrequencyOtherWeeklyDisplayed] = React.useState(true);
  const [isFrequencyOtherYearlyDisplayed, setIsFrequencyOtherYearlyDisplayed] = React.useState(true);
  const [isNextButtonActive, setIsNextButtonActive] = React.useState(false);

  React.useEffect(() => {
    const isCurrentQuestionAnswered = () => {
      if (currentQuestionIndex === 0) {
        return selectedProducts.length > 0;
      }
      if (currentQuestionIndex === 1) {
        return selectedProducts[currentProductIndex]?.frequency !== undefined;
      }
      return false;
    };

    setIsNextButtonActive(isCurrentQuestionAnswered());
  }, [currentQuestionIndex, currentProductIndex, selectedProducts, questions]);

  const handleNextClick = () => {
    console.log({selectedProducts})
    if (currentQuestionIndex === questions.length - 1 && currentProductIndex === selectedProducts.length - 1) {
      setIsLoadingScreenDisplayed(true);
      return;
    }
    if (currentQuestionIndex === 1 && currentProductIndex < selectedProducts.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    } else if (currentQuestionIndex <= questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } 
  };

  const saveData = (newProduct: UserProductConsumption) => {
    if (
      selectedProducts.some(
        (product) => product.name === newProduct.name,
      )
    ) {
      setSelectedProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.name !== newProduct.name,
        ),
      );
    } else {
      setSelectedProducts((prevProducts) => [...prevProducts, newProduct]);
    }
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
              className="relative flex flex-col min-h-screen w-full px-3 py-4 gap-10 transform overflow-hidden bg-v2-blue text-left transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div
                className={`flex ${currentQuestionIndex > 0 ? "justify-between" : "justify-end"}`}
              >
                {currentQuestionIndex > 0 && (
                  <ArrowLeft
                    onClick={() => {
                      if (isLoadingScreenDisplayed && currentProductIndex === selectedProducts.length - 1) {
                        setIsLoadingScreenDisplayed(false);
                        return;
                      }
                      if (currentProductIndex > 0) {
                        setCurrentProductIndex(currentProductIndex - 1);
                        return;
                      } 
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                    }}
                    className="text-v2-pink text-end cta"
                  />
                )}
                <CloseButton
                  onClick={() => {
                    setIsNextButtonActive(false);
                    setCurrentProductIndex(0);
                    setIsQuestionModalOpened(false);
                    setCurrentQuestionIndex(0);
                    setIsLoadingScreenDisplayed(false);
                    setSelectedProducts([]);
                    setIsFrequencyOtherWeeklyDisplayed(true);
                    setIsFrequencyOtherYearlyDisplayed(true);
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
                    { currentQuestionIndex === 0 && (
                      <div
                        key="question-0"
                        className="flex flex-col h-full items-center px-6 gap-10"
                      >
                        <DialogTitle className="h4 lg:h2 text-center text-pretty text-v2-pink">
                          {questions[0].title}
                        </DialogTitle>
                        <div className="flex flex-col w-full gap-4">
                          {questions[0].options.map((option, optionIndex) => {
                              return (
                              <CalculatorCheckboxInputBlock
                                key={`key-question-${optionIndex + 1}`}
                                questionId={0}
                                option={option}
                                optionIndex={optionIndex}
                                selectedProducts={selectedProducts}
                                saveData={(data) => {
                                  saveData(data);
                                }}
                                setSelectedProducts={setSelectedProducts}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                    { currentQuestionIndex === 1 && (
                          <div
                            key={`question-1-product-${currentProductIndex}`}
                            className="flex flex-col h-full items-center px-6 gap-10"
                          >
                            <DialogTitle className="h4 lg:h2 text-center text-pretty text-v2-pink">
                              {t("modal.questions.1.title", { prefix: selectedProducts[currentProductIndex]?.prefix!, label: selectedProducts[currentProductIndex]?.label! })}
                            </DialogTitle>
                            <div className="flex flex-col w-full gap-4">
                              {questions[1].options.map((option, optionIndex) => {
                                if (option.name === "otherFrequency") {
                                  return (
                                    <>
                                      <p className="p-lead text-v2-pink">{option.label}</p>
                                      <div className="flex row">
                                        <div className="inline-flex justify-center items-center gap-2">
                                          <input
                                            key={`question-1-product-${currentProductIndex}-option-${optionIndex + 1}-weekly`}
                                            id={`offers-${optionIndex}`}
                                            name={option.name}
                                            type="number"
                                            placeholder="0"
                                            aria-describedby="offers-description"
                                            value={selectedProducts[currentProductIndex]?.count ? selectedProducts[currentProductIndex]?.count : ""}
                                            onFocus={() => {
                                              setSelectedProducts((prevProducts: UserProductConsumption[]) => {
                                                const updatedProducts = prevProducts.map((product) => {
                                                  if (product.name === selectedProducts[currentProductIndex].name) {
                                                    return { ...product, frequency: undefined, count: undefined};
                                                  }
                                                  return product;
                                                });
                                                return updatedProducts;
                                              });
                                              setIsFrequencyOtherYearlyDisplayed(false);
                                            }}
                                            onChange={(e) => {
                                              setSelectedProducts((prevProducts: UserProductConsumption[]) => {
                                                const updatedProducts = prevProducts.map((product) => {
                                                  if (product.name === selectedProducts[currentProductIndex].name) {
                                                    return { ...product, frequency: "weekly", count: parseInt(e.target.value) };
                                                  }
                                                  return product;
                                                });
                                                return updatedProducts;
                                              });
                                            }}
                                            onBlur={(e) => {
                                              if (e.target.value === "") {
                                                setIsFrequencyOtherYearlyDisplayed(true);
                                              }
                                            }}
                                            className={`
                                              ${isFrequencyOtherWeeklyDisplayed ? "block" : "hidden"}
                                              w-8 p-1
                                              border-0 border-b-2 border-dotted border-v2-pink
                                              bg-v2-blue
                                              caret-v2-magenta
                                              text-v2-magenta text-center

                                              placeholder-v2-pink/50
                                              
                                              hover:ring-v2-magenta

                                              focus:ring-none
                                              focus:border-none
                                              focus:outline-none
                                              focus:text-v2-pink
                                            `}
                                          />
                                          <span className={`${isFrequencyOtherWeeklyDisplayed ? "block" : "hidden"} p-lead text-v2-pink inline-block`}>{option.options ? option.options[0].label : null}</span>
                                          <span className={`text-2xl text-v2-pink inline-block ${isFrequencyOtherWeeklyDisplayed && isFrequencyOtherYearlyDisplayed ? "block" : "hidden"}`}>/</span>
                                          <input
                                            key={`question-1-product-${currentProductIndex}-option-${optionIndex + 1}-yearly`}
                                            id={`offers-${optionIndex}`}
                                            name={option.name}
                                            type="number"
                                            placeholder="0"
                                            aria-describedby="offers-description"
                                            value={selectedProducts[currentProductIndex]?.count ? selectedProducts[currentProductIndex]?.count : ""}
                                            onFocus={() => {
                                              setSelectedProducts((prevProducts: UserProductConsumption[]) => {
                                                const updatedProducts = prevProducts.map((product) => {
                                                  if (product.name === selectedProducts[currentProductIndex].name) {
                                                    return { ...product, frequency: undefined, count: undefined };
                                                  }
                                                  return product;
                                                });
                                                return updatedProducts;
                                              });
                                              setIsFrequencyOtherWeeklyDisplayed(false);
                                            }}
                                            onChange={(e) => {
                                              setSelectedProducts((prevProducts: UserProductConsumption[]) => {
                                                const updatedProducts = prevProducts.map((product) => {
                                                  if (product.name === selectedProducts[currentProductIndex].name) {
                                                    return { ...product, frequency: "yearly", count: parseInt(e.target.value) };
                                                  }
                                                  return product;
                                                });
                                                return updatedProducts;
                                              });
                                            }}
                                            onBlur={(e) => {
                                              if (e.target.value === "") {
                                                setIsFrequencyOtherWeeklyDisplayed(true);
                                              }
                                            }}
                                            className={`
                                              ${isFrequencyOtherYearlyDisplayed ? "block" : "hidden"}
                                              w-8 p-1
                                              border-0 border-b-2 border-dotted border-v2-pink
                                              bg-v2-blue
                                              caret-v2-magenta
                                              text-v2-magenta text-center

                                              placeholder-v2-pink/50
                                              
                                              hover:ring-v2-magenta

                                              focus:ring-none
                                              focus:border-none
                                              focus:outline-none
                                              focus:text-v2-pink`}
                                          />
                                          <span className={`p-lead text-v2-pink inline-block ${isFrequencyOtherYearlyDisplayed ? "block" : "hidden"}`}>{option.options ? option.options[1].label : null}</span>
                                        </div>

                                      </div>
                                    </>


                                  );
                                }
                                return (
                                  <CalculatorRadioInputBlock
                                    key={`question-1-product-${currentProductIndex}-option-${optionIndex + 1}`}
                                    questionId={1}
                                    option={option}
                                    optionIndex={optionIndex}
                                    currentProductIndex={currentProductIndex}
                                    selectedProducts={selectedProducts}
                                    setSelectedProducts={setSelectedProducts}
                                  />
                                );
                              })}
                            </div>
                          </div>
                    )}
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
  selectedProducts: UserProductConsumption[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<UserProductConsumption[]>>;
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
            saveData({ name: "none"  });
            return;
          } else {
            setSelectedProducts(
              (prevProducts: UserProductConsumption[]) => [...prevProducts.filter((product: any) => product.name !== "none")]
            );
          }
          saveData({ name: option.name, label: option.label, prefix: option.prefix });
        }}
        checked={selectedProducts.find((product: any) => product.name === option.name) ? true : false}
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

const CalculatorRadioInputBlock = ({
  questionId,
  option,
  optionIndex,
  setSelectedProducts,
  selectedProducts,
  currentProductIndex,
}: {
  questionId: number;
  option: QuestionOption;
  optionIndex: number;
  selectedProducts: UserProductConsumption[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<UserProductConsumption[]>>;
  currentProductIndex: number;
}) => {
  return (
    <label key={`label-${questionId}`} className="flex items-center gap-4">
      <input
        id={`question-${questionId}-option-${optionIndex + 1}`}
        key={`question-${questionId}-option-${optionIndex + 1}`}
        name="frequency"
        onChange={(e) => {
          setSelectedProducts((prevProducts: UserProductConsumption[]) => {
            const updatedProducts = prevProducts.map((product) => {
              if (product.name === selectedProducts[currentProductIndex].name) {
                return { ...product, frequency: option.name };
              }
              return product;
            });
            return updatedProducts;
          });
        }}
        checked={selectedProducts[currentProductIndex]?.frequency === option.name ? true : false}
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
