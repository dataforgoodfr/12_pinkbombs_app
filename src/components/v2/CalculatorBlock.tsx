import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import Calculator from "@/components/v2/Calculator";
import Button from "@/components/v2/buttons/Button";
const CalculatorBlock = () => {
  const t = useTranslations("site.components");
  return (
    <section>
      <div className="flex bg-v2-blue px-16 py-20">
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
      <div className="flex-1 flex flex-col items-center my-2">
        <Calculator />
        <Button 
          content={t("calculatorBlock.buttonCta")} 
          href="" 
          type="regular"
          backgroundColor="bg-v2-pink"
          textColor="text-v2-blue"
          className="mt-10 mb-2"
        />
        <p className="p-caption italic text-center text-v2-pink w-[90%] mx-auto">
          {t("calculatorBlock.companyHelp")} <a href="/contact" className="underline">{t("calculatorBlock.contactLink")}</a>
        </p>
      </div>
    </div>
      <svg width="1512" height="53" viewBox="0 0 1512 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1410_13851)">
        <rect width="1512" height="53" fill="#13176E"/>
        <path d="M-0.5 21.9809C-0.5 21.9809 108.206 -3.40926 242.838 6.69336C375.925 16.6828 506.201 81.6094 787.788 39.8903C929.538 18.8926 1086.56 -24.8915 1268.95 16.6782C1427.5 52.814 1511.5 26.1469 1511.5 26.1469V170.391H-0.5V21.9763V21.9809Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_1410_13851">
        <rect width="1512" height="53" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    </section>
    
  );
};
export default CalculatorBlock;
