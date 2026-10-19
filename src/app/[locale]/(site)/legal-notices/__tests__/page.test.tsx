import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { getTranslations } from "next-intl/server";

import LegalNoticesPage, { generateMetadata } from "../page";
import enMessages from "../../../../../../messages/en/(site)/pages/legal.json";
import frMessages from "../../../../../../messages/fr/(site)/pages/legal.json";

jest.mock("next-intl/server", () => ({ getTranslations: jest.fn() }));

describe("legal notices", () => {
  it.each([
    ["fr", frMessages],
    ["en", enMessages],
  ] as const)(
    "renders the complete %s policy and metadata",
    async (locale, messages) => {
      const translate = createTranslator({
        locale,
        messages,
        namespace: "legal",
      });
      jest
        .mocked(getTranslations)
        .mockResolvedValue(
          translate as unknown as Awaited<ReturnType<typeof getTranslations>>,
        );
      const params = Promise.resolve({ locale });
      const { container } = render(await LegalNoticesPage({ params }));

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        messages.legal.title,
      );
      expect(
        screen.getByText(messages.legal.effectiveDate),
      ).toBeInTheDocument();
      expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(5);
      for (const section of messages.legal.sections) {
        expect(
          screen.getByRole("heading", { name: section.title }),
        ).toBeInTheDocument();
        for (const block of section.blocks) {
          if (block.type === "heading") {
            expect(
              screen.getByRole("heading", { name: block.text }),
            ).toBeInTheDocument();
          }
        }
      }
      expect(screen.getAllByRole("listitem")).toHaveLength(6);
      expect(container).toHaveTextContent("924 492 986 00014");
      expect(container).toHaveTextContent("+1 951-383-6898");
      expect(container).toHaveTextContent("Hostinger");
      expect(
        screen.getAllByRole("link", { name: "info@seastemik.org" }),
      ).toHaveLength(3);
      expect(screen.getByRole("link", { name: "www.cnil.fr" })).toHaveAttribute(
        "href",
        "https://www.cnil.fr",
      );
      expect(
        screen.getByRole("link", {
          name: "https://creativecommons.org/licenses/by/4.0/deed.fr",
        }),
      ).toHaveAttribute(
        "href",
        "https://creativecommons.org/licenses/by/4.0/deed.fr",
      );
      expect(await generateMetadata({ params })).toEqual(messages.legal.meta);
      expect(getTranslations).toHaveBeenCalledWith({
        locale,
        namespace: "site.legal",
      });
    },
  );

  it("preserves the supplied French cookie statement", () => {
    const cookies = frMessages.legal.sections[4].blocks.find(
      (block) =>
        block.text ===
        "Le Site ne dépose aucun cookie publicitaire ni de suivi.",
    );

    expect(cookies).toBeDefined();
  });
});
