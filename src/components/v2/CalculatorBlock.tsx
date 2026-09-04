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
      <div className="flex flex-col lg:flex-row px-8 lg:px-16 py-20 gap-12 lg:gap-0 max-w-[1592px] mx-auto">
        <div className="w-full lg:w-[55%] xl:w-[40%] flex flex-col items-start gap-6">
          <Image
            loading="lazy"
            src="/site/images/components/calculator-block/sunny-fish.png"
            width={202}
            height={111}
            alt={t("calculatorBlock.imageAlt")}
            className="object-cover"
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
            <p className="p-lead text-v2-pink">
              {t("calculatorBlock.caption")}
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center my-2">
          <Calculator />
          <Button
            content={t("calculatorBlock.buttonCta")}
            href="/"
            type="regular"
            backgroundColor="bg-v2-pink"
            textColor="text-v2-blue"
            className="z-30 mt-10 mb-2 hover:border-v2-pink"
          />
          <p className="z-30 p-caption italic text-center text-v2-pink w-full lg:w-[90%] xl:w-[60%] mx-auto">
            {t("calculatorBlock.companyHelp")}{" "}
            <Link href="/contact" className="underline">
              {t("calculatorBlock.contactLink")}
            </Link>
            .
          </p>
        </div>
      </div>
      <Image
        loading="lazy"
        src="/site/images/components/calculator-block/calculator-block-divider.svg"
        width={1512}
        height={53}
        alt={t("calculatorBlock.imageAlt")}
        className="object-cover xl:w-[2000px]"
      />
    </section>
  );
};
export default CalculatorBlock;
