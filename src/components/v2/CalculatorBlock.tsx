import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import Button from "@/components/v2/buttons/Button";
import Calculator from "@/components/v2/Calculator";

const CalculatorBlock = () => {
  const t = useTranslations("site.components");
  return (
    <section className="bg-v2-blue">
      <div className="flex flex-col xl:flex-row px-8 lg:px-16 py-20 gap-12 lg:gap-0 max-w-[1592px] mx-auto">
        <div className="w-full lg:w-[80%] xl:w-[40%] flex flex-col items-start gap-6 lg:mb-20">
          <Image
            loading="lazy"
            src="/site/images/components/calculator-block/sunny-fish.svg"
            width={202}
            height={111}
            alt={t("calculatorBlock.imageAlt")}
            className="w-[33%] xl:w-[50%] h-[33%] xl:h-[50%] object-cover"
          />
          <div className="flex flex-col gap-4 lg:pl-8">
            <h1 className="h1 -mt-12 lg:-mt-16 text-pretty">
              <span className="text-v2-yellow">
                {t("calculatorBlock.title.part1")}
              </span>
              <span className="text-v2-pink">
                {t("calculatorBlock.title.part2")}
              </span>
            </h1>
            <p className="p-lead text-v2-pink text-pretty">
              {t("calculatorBlock.caption")}
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center my-2">
          <Calculator />
          <Button
            content={t("calculatorBlock.buttonCta")}
            href="/pinkometer"
            type="regular"
            backgroundColor="bg-v2-pink"
            textColor="text-v2-blue"
            className="z-30 mt-10 mb-2 hover:border-v2-pink"
          />
          <p className="z-30 p-caption italic text-center text-v2-pink w-full lg:w-[90%] xl:w-[60%] mx-auto">
            {t("calculatorBlock.companyHelp")}{" "}
            <Link href="mailto:info@seastemik.org" className="underline">
              {t("calculatorBlock.contactLink")}
            </Link>
            .
          </p>
        </div>
      </div>
      <svg
        aria-hidden="true"
        focusable="false"
        className="relative top-px block w-full h-auto overflow-hidden"
        preserveAspectRatio="none"
        width={1512}
        height={53}
        viewBox="0 0 1512 53"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={1512} height={53} fill="#13176E" />
        <path
          d="M-0.5 21.9809C-0.5 21.9809 108.206 -3.40926 242.838 6.69336C375.925 16.6828 506.201 81.6094 787.788 39.8903C929.538 18.8926 1086.56 -24.8915 1268.95 16.6782C1427.5 52.814 1511.5 26.1469 1511.5 26.1469H1514V170.391H-0.5V21.9763V21.9809Z"
          fill="white"
        />
      </svg>
    </section>
  );
};
export default CalculatorBlock;
