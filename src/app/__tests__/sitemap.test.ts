import { getArticleSlug } from "@/lib/articles/slug";

import { siteConfig } from "@/constant/config";

import sitemap from "../sitemap";
import enMessages from "../../../messages/en/(site)/pages/to-be-inspired-articles.json";
import frMessages from "../../../messages/fr/(site)/pages/to-be-inspired-articles.json";

describe("sitemap", () => {
  it("includes the localized main pages and every article without duplicates", () => {
    const urls = sitemap().map(({ url }) => url);
    const expectedPaths = [
      "/",
      "/comprendre",
      "/agir",
      "/s-inspirer",
      "/pinkometre",
      "/a-propos",
      "/en",
      "/en/to-understand",
      "/en/to-act",
      "/en/to-be-inspired",
      "/en/pinkometer",
      "/en/about",
      ...frMessages.toBeInspiredArticle.articles.map(
        ({ id, title }) => `/s-inspirer/${getArticleSlug(title, id)}`,
      ),
      ...enMessages.toBeInspiredArticle.articles.map(
        ({ id, title }) => `/en/to-be-inspired/${getArticleSlug(title, id)}`,
      ),
    ];

    expect(urls).toHaveLength(expectedPaths.length);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(
      expect.arrayContaining(
        expectedPaths.map((pathname) => new URL(pathname, siteConfig.url).href),
      ),
    );
  });

  it("excludes archive, API, and unresolved dynamic URLs", () => {
    for (const { url } of sitemap()) {
      const { pathname, origin } = new URL(url);

      expect(origin).toBe(new URL(siteConfig.url).origin);
      expect(pathname).not.toMatch(/\/(archive|api)(\/|$)/);
      expect(pathname).not.toMatch(/\[|\]|%5B|%5D/i);
    }
  });
});
