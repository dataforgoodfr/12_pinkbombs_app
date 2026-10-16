import { render, screen } from "@testing-library/react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { getArticleSlug } from "@/lib/articles/slug";
import type { ArticleContent } from "@/lib/articles/types";

import ArticlePage from "../page";
import enMessages from "../../../../../../../messages/en/(site)/pages/to-be-inspired-articles.json";
import frMessages from "../../../../../../../messages/fr/(site)/pages/to-be-inspired-articles.json";

jest.mock("next-intl/server", () => ({ getTranslations: jest.fn() }));
jest.mock("next/image", () => ({ __esModule: true, default: jest.fn(() => null) }));
jest.mock("@/components/v2/cards/ArticleCard", () => ({
  __esModule: true,
  default: () => null,
}));

const baseArticle: ArticleContent = {
  id: 1,
  title: "An article",
  summary: "An article summary",
  heroImage: "/hero.jpg",
  heroImageAlt: "Complete hero image",
  heroImageSize: { width: 800, height: 1000 },
  blocks: [],
};

async function renderArticle(overrides: Partial<ArticleContent> = {}) {
  const article = { ...baseArticle, ...overrides };
  const translate = Object.assign(() => "Articles - ", {
    raw: () => [article],
  });
  jest.mocked(getTranslations).mockResolvedValue(
    translate as unknown as Awaited<ReturnType<typeof getTranslations>>,
  );
  return render(
    await ArticlePage({
      params: Promise.resolve({
        locale: "en",
        slug: getArticleSlug(article.title, article.id),
      }),
    }),
  );
}

beforeEach(() => jest.clearAllMocks());

describe("article hero", () => {
  it.each(["left", "right"] as const)(
    "renders a viewport-capped centered image with the text on the %s",
    async (heroTextSide) => {
      const { container } = await renderArticle({ heroTextSide });
      const imageProps = jest.mocked(Image).mock.calls[0][0];

      expect(imageProps).toMatchObject({
        width: 800,
        height: 1000,
        sizes: "100vw",
      });
      expect(imageProps.fill).toBeUndefined();
      expect(imageProps.className?.split(" ")).toEqual(
        expect.arrayContaining([
          "viewport-article-hero-image",
          "block",
          "w-full",
          "h-auto",
          "self-start",
          "object-cover",
          "object-center",
        ]),
      );
      expect(imageProps.className).not.toMatch(/absolute|object-top/);
      expect(container.querySelector("header")).toHaveClass("grid");
      expect(container.querySelector("header")).toHaveAttribute(
        "data-viewport-article-hero",
      );
      expect(screen.getByRole("heading").parentElement).toHaveClass(
        "row-start-2",
        "-translate-y-[5%]",
        "lg:row-start-1",
        "lg:translate-y-0",
        "lg:self-end",
        heroTextSide === "right" ? "lg:ml-auto" : "lg:ml-[8%]",
      );
      expect(screen.getByRole("heading").parentElement).not.toHaveClass(
        "row-start-1",
        "my-5",
      );
    },
  );

  it("keeps the stacked hero layout unchanged", async () => {
    const { container } = await renderArticle({ heroLayout: "stacked" });
    const imageProps = jest.mocked(Image).mock.calls[0][0];

    expect(imageProps).toMatchObject({ width: 800, height: 1000 });
    expect(imageProps.className).toBe(
      "mx-auto block h-auto max-h-[80vh] w-full object-contain",
    );
    expect(container.querySelector("header")).not.toHaveClass("grid");
    expect(container.querySelector("header")).not.toHaveAttribute(
      "data-viewport-article-hero",
    );
  });

  it.each([
    ["en", enMessages.toBeInspiredArticle.articles],
    ["fr", frMessages.toBeInspiredArticle.articles],
  ] as const)("provides matching image dimensions for %s", (_locale, articles) => {
    articles.forEach((article) => {
      expect(article.heroImageSize.width).toBeGreaterThan(0);
      expect(article.heroImageSize.height).toBeGreaterThan(0);
      expect(article.heroImageSize).toEqual(
        enMessages.toBeInspiredArticle.articles.find(
          (item) => item.heroImage === article.heroImage,
        )?.heroImageSize,
      );
    });
  });
});