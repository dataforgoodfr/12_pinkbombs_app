import { getArticleSlug, getLocalizedArticleSlug } from "../slug";
import enMessages from "../../../../messages/en/(site)/pages/to-be-inspired-articles.json";
import frMessages from "../../../../messages/fr/(site)/pages/to-be-inspired-articles.json";

describe("localized article slugs", () => {
  it.each([
    ["\u0153uvrent", "oeuvrent-9"],
    ["\u0152UVRE", "oeuvre-9"],
    ["\u0153uvre et c\u0153ur", "oeuvre-et-coeur-9"],
  ])("expands ligatures in %s", (title, expected) => {
    expect(getArticleSlug(title, 9)).toBe(expected);
  });

  it.each([
    ["en", enMessages.toBeInspiredArticle.articles],
    ["fr", frMessages.toBeInspiredArticle.articles],
  ] as const)("matches %s article titles", (locale, articles) => {
    articles.forEach(({ id, title }) => {
      expect(getLocalizedArticleSlug(id, locale)).toBe(
        getArticleSlug(title, id),
      );
    });
  });

  it("returns undefined for an unknown article", () => {
    expect(getLocalizedArticleSlug(0, "en")).toBeUndefined();
  });
});
