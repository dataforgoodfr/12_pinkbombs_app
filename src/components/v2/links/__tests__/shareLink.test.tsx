import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

jest.mock("next-intl", () => ({
  useLocale: () => "fr",
  useTranslations: () => (key: string) =>
    ({
      "shareLink.blank": "nouvel onglet",
      "shareLink.contactUs": "Contactez-nous",
      "shareLink.site": "Site internet",
      "shareLink.sources": "Approche et méthodologie",
    })[key] ?? key,
}));

jest.mock("@/navigation", () => ({
  Link: ({
    href,
    locale,
    children,
    ...props
  }: {
    href: { pathname: string; hash?: string };
    locale: string;
    children: ReactNode;
  }) => (
    <a
      href={`${href.pathname}${href.hash ? `#${href.hash}` : ""}`}
      data-locale={locale}
      {...props}
    >
      {children}
    </a>
  ),
}));

import ShareLink from "../shareLink";

describe("ShareLink", () => {
  it("does not repeat the visible sources label for screen readers", () => {
    render(
      <ShareLink
        href="/about#approaches-et-methodologies"
        type="sources"
        name="Approche et méthodologie"
      />,
    );

    expect(
      screen
        .getByRole("link", { name: "Approche et méthodologie" })
        .getAttribute("href"),
    ).toBe("/about#approaches-et-methodologies");
  });

  it("announces new tabs only for external links", () => {
    const { rerender } = render(
      <ShareLink href="https://seastemik.org/" name="Seastemik" />,
    );

    expect(
      screen
        .getByRole("link", {
          name: "Site internet Seastemik (nouvel onglet)",
        })
        .getAttribute("target"),
    ).toBe("_blank");

    rerender(
      <ShareLink
        href="mailto:info@seastemik.org"
        type="contactUs"
        name="Contactez-nous"
      />,
    );

    const mailtoLink = screen.getByRole("link", { name: "Contactez-nous" });
    expect(mailtoLink.getAttribute("target")).toBeNull();
    expect(mailtoLink.getAttribute("aria-label")).not.toContain(
      "nouvel onglet",
    );
  });

  it("uses the locale-aware link for internal routes", () => {
    render(
      <ShareLink
        href="/about#approaches-et-methodologies"
        type="sources"
        name="Approche et méthodologie"
      />,
    );

    const link = screen.getByRole("link", {
      name: "Approche et méthodologie",
    });
    expect(link.getAttribute("data-locale")).toBe("fr");
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("aria-label")).not.toContain("nouvel onglet");
  });
});
