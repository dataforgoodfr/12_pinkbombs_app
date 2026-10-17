"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import { getArticleSlug } from "@/lib/articles/slug";
import type { ArticleCardContent } from "@/lib/articles/types";

import CalculatorBlock from "@/components/v2/CalculatorBlock";
import ArticleCard from "@/components/v2/cards/ArticleCard";
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
      <div className="mx-auto grid max-w-[1596px] grid-cols-1 items-center gap-12 px-8 py-10 lg:min-h-[400px] lg:grid-cols-2 lg:gap-10 lg:px-32">
        <div className="flex min-w-0 flex-col gap-4">
          <h4 className="h4 text-pretty">{t("intro.caption")}</h4>
          <h1 className="h1 text-pretty">{t("intro.title")}</h1>
        </div>
        <div className="min-w-0 lg:-mr-32 2xl:mr-0">
          <Image
            loading="lazy"
            src="/site/images/to-be-inspired/intro.svg"
            width={841}
            height={461}
            alt={t("intro.imageAlt")}
            className="relative lg:top-[48px] ml-auto h-auto w-full object-contain object-right scale-[120%]"
          />
        </div>
      </div>
    </section>
  );
};

const ArticleSection = () => {
  const t = useTranslations("site.toBeInspiredArticle");
  const articleCardItems = t.raw("articles") as ArticleCardContent[];
  return (
    <section className="bg-v2-magenta">
      <div className="bg-v2-yellow">
        <Image
          loading="lazy"
          src="/site/images/to-be-inspired/intro-divider.svg"
          width={1512}
          height={103}
          alt=""
          className="block h-auto w-full"
        />
      </div>
      <div className="mx-auto grid max-w-[1596px] grid-cols-1 justify-items-center gap-6 px-8 py-12 md:grid-cols-2 lg:grid-cols-4 lg:px-32 2xl:py-24">
        {articleCardItems.map((article, index) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            slug={getArticleSlug(article.title, article.id)}
            variant={(index + 1) % 5 === 0 ? "wide" : "standard"}
            image={{
              src: article.heroImage,
              alt: article.heroImageAlt,
            }}
          />
        ))}
      </div>
    </section>
  );
};
