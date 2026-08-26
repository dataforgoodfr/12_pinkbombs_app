import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import ArticleCard, { ArticleCardProps } from "@/components/v2/cards/ArticleCard";
const ArticlesBlock = () => {
  const t = useTranslations("site.components");
  const articleCardItems = t.raw("articlesBlock.articles.homepage") as ArticleCardProps[];
  return (
    <section className="bg-white px-16 py-20">
      <Image
        loading="lazy"
        src="/site/images/components/articles-block/diving-fish.svg"
        width={217}
        height={104}
        alt={t("articlesBlock.imageAlt")}
        className="object-contain mx-auto"
      />
      <h2 className="h2 text-center text-v2-blue">{t("articlesBlock.title")}</h2>
      <div className="flex gap-4 py-4">
        {articleCardItems.map((item, index) => (
          <ArticleCard
            key={index}
            className="mx-auto"
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
