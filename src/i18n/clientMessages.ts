import type { AbstractIntlMessages } from "next-intl";

import type { ArticleCardContent } from "@/lib/articles/types";

export function getClientMessages(
  messages: AbstractIntlMessages,
): AbstractIntlMessages {
  const site = messages.site;
  if (!site || typeof site === "string") return messages;

  const articleMessages = site.toBeInspiredArticle;
  if (!articleMessages || typeof articleMessages === "string") return messages;

  const articles = articleMessages.articles;
  if (!Array.isArray(articles)) return messages;

  const cards = articles.map(
    ({ id, title, heroImage, heroImageAlt }: ArticleCardContent) => ({
      id,
      title,
      heroImage,
      heroImageAlt,
    }),
  );

  return {
    ...messages,
    site: {
      ...site,
      toBeInspiredArticle: {
        ...articleMessages,
        articles: cards as unknown as AbstractIntlMessages,
      },
    },
  };
}
