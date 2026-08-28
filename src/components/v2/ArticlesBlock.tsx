import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import ArticleCard, {
  ArticleCardProps,
} from "@/components/v2/cards/ArticleCard";

interface ArticlesBlockProps {
  page?: "homepage" | "about" | "toAct";
}

const ArticlesBlock = ({ page = "homepage" }: ArticlesBlockProps) => {
  const t = useTranslations("site.components");
  const articleCardItems = t.raw(
    `articlesBlock.articles.${page}`,
  ) as ArticleCardProps[];
  return (
    <section className="bg-white px-10 lg:px-16 py-20">
      <Image
        loading="lazy"
        src="/site/images/components/articles-block/diving-fish.svg"
        width={217}
        height={104}
        alt={t("articlesBlock.imageAlt")}
        className="object-contain mx-auto"
      />
      <h2 className="h2 text-center text-v2-blue text-pretty">
        {t("articlesBlock.title")}
      </h2>
      <div className="flex flex-col justify-center md:grid grid-cols-2 lg:flex lg:flex-row gap-10 lg:gap-8 py-4 max-w-[1592px] mx-auto">
        {articleCardItems.map((item, index) => (
          <ArticleCard
            key={index}
            title={item.title}
            description={item.description}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
            buttonCta={item.buttonCta}
            buttonUrl={item.buttonUrl}
          />
        ))}
      </div>
    </section>
  );
};
export default ArticlesBlock;
