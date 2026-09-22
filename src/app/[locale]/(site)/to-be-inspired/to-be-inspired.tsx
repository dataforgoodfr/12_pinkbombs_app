"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import CalculatorBlock from "@/components/v2/CalculatorBlock";
import ArticleCard, {
  ArticleCardProps,
} from "@/components/v2/cards/ArticleCard";
import ExplorationBlock from "@/components/v2/ExplorationBlock";

const ToBeInspired = () => {
  return (
    <>
      <IntroSection />
      <ArticleSection />
      <CalculatorBlock />
      <ExplorationBlock page="toBeInspired" />
    </>
  );
};

export default ToBeInspired;

const IntroSection = () => {
  const t = useTranslations("site.toBeInspired");

  return (
    <section className="bg-v2-yellow text-v2-blue">
      <div className="flex flex-col lg:flex-row px-12 pt-12 pb-4 xl:pb-0 lg:pt-40 lg:pl-24 gap-12 lg:gap-0 justify-center mx-auto">
        <div className="flex flex-col gap-4 lg:w-[40%]">
          <h4 className="h4 text-pretty">{t("intro.caption")}</h4>
          <h1 className="h1 text-pretty">{t("intro.title")}</h1>
        </div>
        <div className="flex flex-col lg:w-[60%]">
          <Image
            loading="lazy"
            src="/site/images/to-be-inspired/intro.svg"
            width={841}
            height={461}
            alt={t("intro.imageAlt")}
            className="relative z-0 xl:-top-10 object-contain"
          />
        </div>
      </div>
      <div className="z-2 relative -mt-8 md:-mt-20 lg:-mt-20 xl:-mt-28 2xl:-mt-32">
        <Image
          loading="lazy"
          src="/site/images/to-be-inspired/intro-divider.svg"
          width={841}
          height={461}
          alt={t("intro.imageAlt")}
          className="object-cover4 md:w-[1024px] lg:w-[1440px] xl:w-[2000px]"
        />
      </div>
    </section>
  );
};

const ArticleSection = () => {
  const t = useTranslations("site.toBeInspired");
  const articleCardItems = t.raw("articles") as ArticleCardProps[];
  return (
    <section className="bg-v2-magenta">
      <div className="p-10 lg:py-16 lg:px-28 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:max-w-[1279px] mx-auto">
        {articleCardItems.map((article, index) => (
          <ArticleCard
            key={index}
            id={article.id}
            title={article.title}
            type={article.type}
            image={article.image}
          />
        ))}
      </div>
    </section>
  );
};
