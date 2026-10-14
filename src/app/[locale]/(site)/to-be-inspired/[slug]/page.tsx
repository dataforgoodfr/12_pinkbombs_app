import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { getArticleSlug } from "@/lib/articles/slug";
import type { ArticleContent, ArticleContentBlock } from "@/lib/articles/types";

import ArticleCard from "@/components/v2/cards/ArticleCard";

type ArticlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getArticle(locale: string, slug: string) {
  const t = await getTranslations({
    locale,
    namespace: "site.toBeInspiredArticle",
  });
  const articles = t.raw("articles") as ArticleContent[];

  return {
    page: t("page"),
    relatedArticlesTitle: t("relatedArticlesTitle"),
    articles,
    article: articles.find(
      (article) => getArticleSlug(article.title, article.id) === slug,
    ),
  };
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getArticle(locale, slug);

  if (!data.article) notFound();

  return {
    title: data.page + data.article.title,
    description: data.article.summary,
    openGraph: {
      title: data.article.title,
      description: data.article.summary,
      images: [data.article.heroImage],
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const article = await getArticle(locale, slug);

  if (!article.article) notFound();

  const relatedArticles = (article.article.relatedArticleIds ?? []).flatMap(
    (id) => article.articles.find((item) => item.id === id) ?? [],
  );

  return (
    <>
      <article className="bg-white text-v2-blue">
        <header className="relative isolate bg-white md:flex md:min-h-[600px] md:items-end md:overflow-hidden">
          <div className="relative h-[360px] overflow-hidden md:absolute md:inset-0 md:h-auto md:overflow-visible">
            <Image
              src={article.article.heroImage}
              alt={article.article.heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-v2-blue/20" />
          </div>
          <div className="relative z-10 mx-4 -translate-y-[10%] max-w-2xl bg-white p-5 md:mb-12 md:ml-[8%] md:translate-y-0 md:p-8">
            <h1 className="h1 text-pretty">{article.article.title}</h1>
            <p className="mt-4 text-sm leading-relaxed md:text-base">
              {article.article.summary}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 md:px-8 md:py-16">
          {article.article.blocks.map((block, index) => (
            <ArticleBlockView key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="bg-v2-magenta pt-12 text-v2-blue md:pt-16">
          <h2 className="h3 px-5 text-center text-black">
            {article.relatedArticlesTitle}
          </h2>
          <div className="mx-auto grid max-w-[1000px] grid-cols-1 justify-items-center gap-6 px-5 py-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.id}
                id={relatedArticle.id}
                title={relatedArticle.title}
                slug={getArticleSlug(relatedArticle.title, relatedArticle.id)}
                image={{
                  src: relatedArticle.heroImage,
                  width: relatedArticle.id === 5 ? 969 : 302,
                  height: relatedArticle.id === 5 ? 412 : 242,
                  alt: relatedArticle.heroImageAlt,
                }}
              />
            ))}
          </div>
          <Image
            src="/site/images/to-be-inspired/more-articles-divider.svg"
            width={1512}
            height={53}
            alt=""
            aria-hidden="true"
            className="w-full"
          />
        </section>
      )}
    </>
  );
}

function ArticleBlockView({ block }: { block: ArticleContentBlock }) {
  if (block.type === "heading") {
    return <h2 className="h3 mt-12 text-pretty first:mt-0">{block.text}</h2>;
  }

  if (block.type === "image") {
    return (
      <figure className="my-10">
        {block.src ? (
          <Image
            src={block.src}
            alt={block.alt}
            width={1440}
            height={900}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded-md object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={block.alt}
            className="aspect-[16/10] w-full bg-v2-yellow"
          />
        )}
        {block.caption && (
          <figcaption className="mt-2 text-xs leading-relaxed">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "youtube") {
    return (
      <div className="my-10 aspect-video overflow-hidden rounded-md">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${block.videoId}`}
          title={block.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <p className="my-5 text-base leading-relaxed md:text-lg">
      {block.segments.map((segment, index) =>
        segment.type === "link" && segment.href ? (
          <a
            key={`${index}-${segment.text}`}
            href={segment.href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-1 underline-offset-2 hover:text-v2-magenta"
          >
            {renderInlineText(segment.text)}
          </a>
        ) : (
          <span key={`${index}-${segment.text}`}>
            {renderInlineText(segment.text)}
          </span>
        ),
      )}
    </p>
  );
}

function renderInlineText(text: string): ReactNode[] {
  return text.split(/(<strong>[\s\S]*?<\/strong>)/g).map((part, index) => {
    const strongText = part.match(/^<strong>([\s\S]*?)<\/strong>$/)?.[1];

    return strongText === undefined ? (
      part
    ) : (
      <strong key={`strong-${index}`}>{strongText}</strong>
    );
  });
}
