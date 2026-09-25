"use client";

import { useTranslations } from "next-intl";

interface ErrorScreenProps {
  onRetry: () => void;
}

export const ErrorScreen = ({ onRetry }: ErrorScreenProps) => {
  const t = useTranslations("site.calculator");

  return (
    <div className="flex flex-col items-center text-center gap-8 px-4 mx-auto">
      <div className="gap-4 flex flex-col items-center text-center">
        <h2 className="h2 text-pretty text-v2-pink">{t("error.title")}</h2>
        <p className="p-lead text-pretty text-v2-pink">{t("error.caption")}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex cta border-2 rounded-xl pointer-events-auto border-v2-blue hover:border-v2-pink hover:bg-v2-blue hover:text-v2-pink px-8 cursor-pointer text-v2-blue bg-v2-pink px-4 py-2 text-sm lg:text-base w-fit"
      >
        {t("error.retry")}
      </button>
    </div>
  );
};
