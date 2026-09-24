"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Question, UserProductConsumption } from "./types";

interface SummaryScreenProps {
  products: UserProductConsumption[];
  questions: Question[];
  onSubmit: () => void;
}

export const SummaryScreen = ({
  products,
  questions,
  onSubmit,
}: SummaryScreenProps) => {
  const t = useTranslations("site.calculator");
  const variantQuestion = questions[1]?.subQuestions ?? [];

  return (
    <div className="flex flex-col lg:grid grid-cols-2 justify-center lg:items-center px-4 gap-12 lg:gap-24 lg:pt-10">
      <Image
        loading="lazy"
        src="/site/images/homepage/fish-plate.svg"
        width={571}
        height={425}
        alt=""
        className="object-contain h-auto mx-auto lg:mx-0 lg:ml-auto w-[50%] h-[20%] md:w-[30%] md:h-[30%] lg:w-[80%] lg:h-[80%]"
      />
      <div className="flex flex-col gap-8 justify-center lg:justify-start">
        <h4 className="h4 text-pretty text-v2-pink text-center lg:text-left">
          {t("sumUp.title")}
        </h4>
        <div className="flex flex-col border-l-4 pl-4 border-v2-magenta gap-2 mx-auto lg:mx-0 lg:items-start">
          {products.map((product) => {
            const filteredVariants = product.variants.filter(
              ({ count }) => count > 0,
            );
            const labels =
              variantQuestion.find(({ name }) => name === product.name)
                ?.options ?? [];
            return (
              <div
                key={product.name}
                className="flex flex-col justify-start pb-2 border-b-2 border-v2-magenta/20"
              >
                <p className="p-lead text-v2-pink">
                  {product.label.charAt(0).toUpperCase() +
                    product.label.slice(1)}
                </p>
                <p className="p-caption px-2 text-v2-pink">
                  {product.frequency === "otherWeekly" ||
                  product.frequency === "otherYearly"
                    ? product.occurrence
                    : ""}{" "}
                  {product.frequencyLabel}
                </p>
                {filteredVariants.length > 0 && (
                  <p className="p-caption px-2 text-v2-pink italic">
                    {t("sumUp.around")}
                    {filteredVariants.map((variant, index) => {
                      const label =
                        labels.find(({ name }) => name === variant.type)
                          ?.label ?? variant.type;
                      return (
                        <span
                          key={variant.type}
                          className="inline-block ml-1 p-caption text-v2-pink"
                        >
                          {variant.count} {label}
                          {variant.count > 1 ? "s" : ""}
                          {index < filteredVariants.length - 1 ? "," : ""}
                        </span>
                      );
                    })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col justify-center items-center lg:items-start gap-2">
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex cta border-2 rounded-xl pointer-events-auto border-v2-blue hover:border-v2-pink hover:bg-v2-blue hover:text-v2-pink px-8 mx-auto lg:mx-0 z-30 cursor-pointer text-v2-blue bg-v2-pink px-4 py-2 text-sm lg:text-base w-fit"
          >
            {t("sumUp.button")}
          </button>
          <p className="pt-2 p-caption italic text-v2-pink text-center max-w-[80%]">
            {t("sumUp.caption")}
          </p>
        </div>
      </div>
    </div>
  );
};
