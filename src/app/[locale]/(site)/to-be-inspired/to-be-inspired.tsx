"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import ExplorationBlock from "@/components/v2/ExplorationBlock";
import CalculatorBlock from "@/components/v2/CalculatorBlock";
import ArticleCard, { ArticleCardProps } from "@/components/v2/cards/ArticleCard";

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
    <section className="bg-v2-yellow text-v2-pink">
      <Image
        loading="lazy"
        src="/site/images/to-be-inspired/intro.svg"
        width={1512}
        height={477}
        alt={t("intro.imageAlt")}
        className="object-contain h-auto mx-auto lg:pt-24 xl:w-[2000px]"
      />
    </section>
  );
};


const ArticleSection = () => {
  const t = useTranslations("site.toBeInspired");
  const articleCardItems = t.raw(
      "articles",
    ) as ArticleCardProps[];
  return (
    <section className="py-16 px-28 grid grid-cols-1 gap-6 lg:grid-cols-4 bg-v2-magenta text-v2-pink">
      {
        articleCardItems.map((article, index) => (
          <ArticleCard
            key={index}
            id={article.id}
            title={article.title}
            type={article.type}
            image={article.image}
          />
        ))
      }
    </section>
  );
};
