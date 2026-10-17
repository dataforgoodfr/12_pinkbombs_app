import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

jest.mock("next-intl", () => ({
  useLocale: () => "en",
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import AccordionCardButton from "../AccordionCardButton";

describe("AccordionCardButton", () => {
  it("keeps the English locale in generated article URLs", () => {
    render(
      <AccordionCardButton
        content="Read article"
        id={1}
        index={0}
        type="internalArticle"
      />,
    );

    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/en/to-be-inspired/salmon-a-symbol-of-an-industry-1",
    );
  });
});
