import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import Calculator from "@/components/v2/Calculator";
const CalculatorBlock = () => {
  const t = useTranslations("site.components");
  return (
    <div className="flex bg-v2-blue p-20">
      <div className="w-[55%] flex flex-col items-start gap-6">
        <Image
          loading="lazy"
          src="/site/images/components/calculator-block/sunny-fish.png"
          width={202}
          height={111}
          alt={t("calculatorBlock.imageAlt")}
          className="object-cover"
        />
        <div className="flex flex-col gap-4 pl-8">
          <h1 className="h1 -mt-16">
            <span className="text-v2-yellow">{t("calculatorBlock.title.part1")}</span>
            <span className="text-v2-pink">{t("calculatorBlock.title.part2")}</span>
          </h1>
          <p className="p-lead text-v2-pink">{t("calculatorBlock.caption")}</p>        
        </div>
      </div>
      <Calculator className="flex-1" />
    </div>
  );
};
export default CalculatorBlock;
