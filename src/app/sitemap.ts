import type { MetadataRoute } from "next";

import { getArticleSlug } from "@/lib/articles/slug";

import { siteConfig } from "@/constant/config";
import { getPathname, locales } from "@/navigation";

import enMessages from "../../messages/en/(site)/pages/to-be-inspired-articles.json";
import frMessages from "../../messages/fr/(site)/pages/to-be-inspired-articles.json";

const pagePaths = [
  "/",
  "/to-understand",
  "/to-act",
  "/to-be-inspired",
  "/pinkometer",
  "/about",
] as const;

const articlesByLocale = {
  en: enMessages.toBeInspiredArticle.articles,
  fr: frMessages.toBeInspiredArticle.articles,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    ...pagePaths.map((href) => ({
      url: new URL(getPathname({ locale, href }), siteConfig.url).href,
    })),
    ...articlesByLocale[locale].map(({ id, title }) => ({
      url: new URL(
        getPathname({
          locale,
          href: {
            pathname: "/to-be-inspired/[slug]",
            params: { slug: getArticleSlug(title, id) },
          },
        }),
        siteConfig.url,
      ).href,
    })),
  ]);
}
