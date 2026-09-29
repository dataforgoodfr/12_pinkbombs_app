import type { Question } from "./types";

export const createDisplayLabelLookup = (questions: Question[]) => {
  const productOptions = questions[0]?.options ?? [];
  const variantOptions = (questions[1]?.subQuestions ?? []).flatMap(
    (subQuestion) => subQuestion.options,
  );

  return (key: string): string =>
    productOptions.find(({ name }) => name === key)?.label ??
    variantOptions.find(({ name }) => name === key)?.label ??
    key;
};
