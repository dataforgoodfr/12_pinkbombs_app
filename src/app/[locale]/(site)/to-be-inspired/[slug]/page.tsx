import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { getArticleSlug } from "@/lib/articles/slug";
import type {
  ArticleContent,
  ArticleContentBlock,
  ArticleTextSegment,
} from "@/lib/articles/types";

import ArticleCard from "@/components/v2/cards/ArticleCard";
import ResponsiveSvgDivider from "@/components/v2/ResponsiveSvgDivider";

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

  const relatedArticle = article.article.relatedSection?.articleId
    ? article.articles.find(
        (item) => item.id === article.article?.relatedSection?.articleId,
      )
    : undefined;
  const heroTextSide = article.article.heroTextSide ?? "left";
  const heroTextSideClass =
    heroTextSide === "right" ? "lg:ml-auto lg:mr-[8%]" : "lg:ml-[8%]";
  const isStackedHero = article.article.heroLayout === "stacked";
  return (
    <>
      <article className="bg-white text-v2-blue">
        <header
          data-viewport-article-hero={isStackedHero ? undefined : true}
          className={
            isStackedHero
              ? "bg-white"
              : "relative isolate grid grid-cols-1 bg-white"
          }
        >
          {isStackedHero ? (
            <Image
              src={article.article.heroImage}
              alt={article.article.heroImageAlt}
              width={article.article.heroImageSize?.width ?? 1440}
              height={article.article.heroImageSize?.height ?? 960}
              priority
              sizes="100vw"
              className="mx-auto block h-auto max-h-[80vh] w-full object-contain"
            />
          ) : (
            <Image
              src={article.article.heroImage}
              alt={article.article.heroImageAlt}
              width={article.article.heroImageSize?.width ?? 1440}
              height={article.article.heroImageSize?.height ?? 960}
              priority
              sizes="100vw"
              className="viewport-article-hero-image col-start-1 row-start-1 block h-auto w-full self-start object-cover object-center"
            />
          )}
          <div
            className={
              isStackedHero
                ? "mx-auto max-w-3xl px-5 py-8 md:px-8 lg:py-12"
                : `relative z-10 col-start-1 row-start-2 mx-4 mb-5 -translate-y-[5%] max-w-2xl bg-v2-yellow p-5 lg:row-start-1 lg:my-12 lg:self-end lg:translate-y-0 lg:p-8 ${heroTextSideClass}`
            }
          >
            <h1 className="h1 text-pretty">{article.article.title}</h1>
            <p className="mt-4 text-sm leading-relaxed lg:text-base">
              {article.article.summary}
            </p>
          </div>
        </header>

        {article.article.heroImageCredit && (
          <p className="mx-auto max-w-3xl px-5 pt-3 text-right text-xs text-v2-blue/70 md:px-8">
            {locale === "fr" ? "Crédit photo : " : "Photo credit: "}
            {article.article.heroImageCredit}
          </p>
        )}

        <div className="max-w-3xl px-8 md:py-16 mx-auto">
          {article.article.blocks.map((block, index) => (
            <ArticleBlockView key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      </article>

      {article.article.relatedSection && (
        <section className="bg-v2-magenta pt-12 text-black md:pt-16">
          <h2 className="h2 px-5 text-center">
            {article.article.relatedSection.title}
          </h2>
          <div className="mx-auto max-w-3xl py-3 px-8 text-center">
            {article.article.relatedSection.paragraphs.map(
              (segments, index) => (
                <ArticleParagraphView
                  key={`related-${index}`}
                  segments={segments}
                />
              ),
            )}
          </div>
          {relatedArticle && (
            <div className="flex justify-center px-8 lg:px-32 pb-8">
              <ArticleCard
                key={relatedArticle.id}
                id={relatedArticle.id}
                title={relatedArticle.title}
                slug={getArticleSlug(relatedArticle.title, relatedArticle.id)}
                variant="standard"
                image={{
                  src: relatedArticle.heroImage,
                  alt: relatedArticle.heroImageAlt,
                }}
              />
            </div>
          )}
          <ResponsiveSvgDivider
            src="/site/images/to-be-inspired/more-articles-divider.svg"
            width={1512}
            height={53}
          />
        </section>
      )}
    </>
  );
}

function ArticleBlockView({ block }: { block: ArticleContentBlock }) {
  if (block.type === "heading") {
    return (
      <h2
        className={`h3 mt-12 text-pretty first:mt-0 ${block.strikethrough ? "line-through decoration-2" : ""}`}
      >
        {block.text}
      </h2>
    );
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

  if (block.type === "list") {
    return (
      <ul className="my-5 list-disc space-y-3 pl-6 text-base leading-relaxed md:text-lg">
        {block.items.map((item, index) => (
          <li key={`${index}-${item}`}>{renderInlineText(item)}</li>
        ))}
      </ul>
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

  return <ArticleParagraphView segments={block.segments} />;
}

function ArticleParagraphView({
  segments,
}: {
  segments: ArticleTextSegment[];
}) {
  return (
    <p className="my-5 text-base leading-relaxed md:text-lg text-pretty">
      {segments.map((segment, index) =>
        segment.type === "link" && segment.href ? (
          <a
            key={`${index}-${segment.text}`}
            href={segment.href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-1 underline-offset-2 hover:font-semibold"
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
