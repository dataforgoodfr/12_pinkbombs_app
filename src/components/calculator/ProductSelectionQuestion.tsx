"use client";

import { getDefaultVariants } from "./constants";
import type { QuestionOption, UserProductConsumption } from "./types";

interface ProductSelectionQuestionProps {
  options: QuestionOption[];
  products: UserProductConsumption[];
  onToggleProduct: (product: UserProductConsumption) => void;
}

export const ProductSelectionQuestion = ({
  options,
  products,
  onToggleProduct,
}: ProductSelectionQuestionProps) => {
  return (
    <div className="flex flex-col md:mx-auto gap-4">
      {options.map((option, optionIndex) => {
        const product: UserProductConsumption = {
          name: option.name,
          label: option.label,
          prefix: option.prefix,
          variants: getDefaultVariants(option.name),
        };

        return (
          <label
            key={`question-product-option-${optionIndex}`}
            className="flex items-center gap-4 cursor-pointer"
          >
            <input
              id={`question-product-option-${optionIndex}`}
              name={`question-product-option-${optionIndex}`}
              type="checkbox"
              checked={products.some(({ name }) => name === option.name)}
              onChange={() => onToggleProduct(product)}
              aria-label={option.label}
              className="
                cursor-pointer appearance-none w-6 h-6 p-1 rounded-full
                border border-v2-magenta bg-v2-pink checked:bg-v2-magenta
                checked:ring-v2-magenta hover:ring-v2-magenta hover:bg-v2-magenta
                focus:ring focus:ring-v2-magenta focus:ring-offset-v2-pink
                focus:bg-v2-magenta focus:text-v2-magenta"
            />
            <span className="p-lead text-v2-pink">
              {option.name === "none"
                ? option.label
                : option.label.charAt(0).toUpperCase() + option.label.slice(1)}
            </span>
          </label>
        );
      })}
    </div>
  );
};
