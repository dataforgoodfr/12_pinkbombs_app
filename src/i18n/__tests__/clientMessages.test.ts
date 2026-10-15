import { describe, expect, it } from "@jest/globals";
import type { AbstractIntlMessages } from "next-intl";

import { getClientMessages } from "@/i18n/clientMessages";

import enMessages from "../../../messages/en/(site)/pages/to-be-inspired-articles.json";
import frMessages from "../../../messages/fr/(site)/pages/to-be-inspired-articles.json";

describe("client messages", () => {
  it.each([
    ["en", enMessages],
    ["fr", frMessages],
  ] as const)(
    "includes only article card fields for %s",
    (_locale, catalog) => {
      const messages = {
        archive: { title: "Archive" },
        site: {
          components: { title: "Components" },
          toBeInspiredArticle: {
            ...catalog.toBeInspiredArticle,
            articles: catalog.toBeInspiredArticle.articles.map((article) => ({
              ...article,
              futureBody: "This must remain server-side",
            })),
          },
        },
      };
      const original = JSON.stringify(messages);

      const clientMessages = getClientMessages(
        messages as unknown as AbstractIntlMessages,
      );

      expect(clientMessages).toEqual({
        ...messages,
        site: {
          ...messages.site,
          toBeInspiredArticle: {
            ...messages.site.toBeInspiredArticle,
            articles: catalog.toBeInspiredArticle.articles.map((article) => ({
              id: article.id,
              title: article.title,
              heroImage: article.heroImage,
              heroImageAlt: article.heroImageAlt,
            })),
          },
        },
      });
      expect(JSON.stringify(messages)).toBe(original);
      expect(
        messages.site.toBeInspiredArticle.articles.every(
          (article) => article.blocks.length > 0,
        ),
      ).toBe(true);
      expect(JSON.stringify(clientMessages).length).toBeLessThan(
        original.length,
      );
    },
  );

  it.each<AbstractIntlMessages>([
    {},
    { site: {} },
    { site: "Site" },
    { site: { toBeInspiredArticle: "Articles" } },
    { site: { toBeInspiredArticle: { page: "Articles" } } },
  ])("preserves messages without an article catalog: %j", (messages) => {
    expect(getClientMessages(messages)).toBe(messages);
  });
});
