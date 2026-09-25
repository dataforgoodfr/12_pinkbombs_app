"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import { CalculatorModal } from "@/components/calculator/CalculatorModal";
import type { Question } from "@/components/calculator/types";
import Calculator from "@/components/v2/Calculator";

const CalculatorPage = () => {
  const t = useTranslations("site.calculator");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const questions = t.raw("modal.questions") as Question[];

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
            onClick={() => setIsModalOpen(true)}
            className="inline-flex cta border-2 rounded-xl pointer-events-auto border-v2-blue hover:bg-white hover:text-v2-blue px-8 mx-auto z-30 cursor-pointer text-v2-pink bg-v2-blue px-4 py-2 text-sm lg:text-base w-fit"
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
          className="object-cover w-full xl:w-[2000px]"
        />
      </section>
      <CalculatorModal
        open={isModalOpen}
        questions={questions}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CalculatorPage;
