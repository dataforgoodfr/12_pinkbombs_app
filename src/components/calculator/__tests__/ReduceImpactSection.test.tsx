import { jest } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import path from "node:path";

import type { ImpactLevel } from "@/lib/calculator/computeConsumption";
import type { CalculatorSubmissionResponse } from "@/lib/calculator/submission";

jest.mock("@/lib/calculator/persistedSubmission", () => ({
  persistCalculatorSubmission: jest.fn(async () => ({
    success: true,
    id: 1,
    replayed: false,
  })),
}));

jest.mock("next-intl", () => ({
  useLocale: jest.fn(() => "fr"),
  useTranslations: () => {
    type MockTranslate = ((key: string) => string) & {
      has: (key: string) => boolean;
      raw: (key: string) => unknown;
    };
    const translate = ((key: string) => {
      if (key === "reduceImpact.step4.title") return "Step 4";
      if (key === "reduceImpact.step4.alternatives.flaxSeedOil") {
        return "Flaxseed oil";
      }
      if (key === "reduceImpact.step4.alternatives.fishOil") return "Fish oil";
      if (key === "reduceImpact.step4.info.fishOil") {
        return "Fish oil comes from the same fisheries that feed farmed salmon.";
      }
      if (key === "reduceImpact.step4.falseFriend") return "False friend";
      return key;
    }) as MockTranslate;
    translate.has = (key) =>
      key === "reduceImpact.step4.info.fishOil" ||
      key === "badges.neutral.width" ||
      key === "badges.neutral.height";
    translate.raw = (key) => {
      if (key === "badges.neutral.width") return 212;
      if (key === "badges.neutral.height") return 361;
      return key === "labels"
        ? [
            { label: "neutral", text: "Neutral", color: "green" },
            { label: "low", text: "Low", color: "yellow" },
            { label: "medium", text: "Medium", color: "magenta" },
            { label: "high", text: "High", color: "red" },
            { label: "veryHigh", text: "Very High", color: "black" },
          ]
        : [];
    };
    return translate;
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
  }) => (
    <span
      role="img"
      aria-label={alt}
      data-src={src}
      data-width={width}
      data-height={height}
    />
  ),
}));

jest.mock("../DesktopImpactPanel", () => ({
  DesktopImpactPanel: () => null,
}));

jest.mock("../../v2/Calculator", () => ({
  __esModule: true,
  default: () => <div data-testid="impact-calculator" />,
}));

const { ReduceImpactSection } = jest.requireActual<
  typeof import("../ReduceImpactSection")
>("../ReduceImpactSection");

const { useLocale } = jest.requireMock<{
  useLocale: jest.Mock<() => string>;
}>("next-intl");

const response: CalculatorSubmissionResponse = {
  totalConsoInKg: 0,
  consoPerProduct: {},
  impact: "neutral",
};

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

describe("ReduceImpactSection Step 4 info", () => {
  it("opens and dismisses the fish oil tooltip independently of its disabled radio", () => {
    render(
      <ReduceImpactSection
        questions={[]}
        response={response}
        products={[]}
        submissionService={async () => response}
        reduceImpact={{
          engagementsConfirmed: false,
          activeAccordionIndex: 3,
          selectedProductKey: null,
          replacementFrequencyPerYear: null,
          selectedAlternative: null,
          selectedSupplement: null,
        }}
        onSelectProduct={() => {}}
        onConfirmEngagements={() => {}}
        onFrequencyChange={() => {}}
        onConfirmFrequency={() => {}}
        onSelectAlternative={() => {}}
        onSelectSupplement={() => {}}
        onSetActiveAccordion={() => {}}
        onNewsletterInvalidEmail={() => {}}
        onNewsletterSuccess={() => {}}
        onNewsletterError={() => {}}
      />,
    );

    const infoButton = screen.getByRole("button", { name: "Fish oil" });
    expect(infoButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("radio", { name: /Fish oil/ })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Flaxseed oil" })).toBeNull();

    fireEvent.click(infoButton);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent(
      "Fish oil comes from the same fisheries that feed farmed salmon.",
    );
    expect(infoButton).toHaveAttribute("aria-expanded", "true");
    expect(infoButton).toHaveAttribute("aria-controls", tooltip.id);
    expect(infoButton).toHaveAttribute("aria-describedby", tooltip.id);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(infoButton).toHaveAttribute("aria-expanded", "false");
  });
});

describe("ReduceImpactSection no-consumption result", () => {
  const badgeCases: { impact: ImpactLevel; fr: string; en: string }[] = [
    { impact: "neutral", fr: "Super_saumon.e.jpg", en: "Super_Salmon.jpg" },
    { impact: "low", fr: "Grand.e_saumon.e.jpg", en: "Great_Salmon.jpg" },
    { impact: "medium", fr: "Saumon.e_Ado.jpg", en: "Teen_Salmon.jpg" },
    { impact: "high", fr: "B\u00e9b\u00e9_saumon.jpg", en: "Baby_Salmon.jpg" },
    { impact: "veryHigh", fr: "Graine_de_saumon.jpg", en: "Salmon_seed.jpg" },
  ];

  afterEach(() => {
    jest.mocked(useLocale).mockReturnValue("fr");
  });

  it.each(
    badgeCases.flatMap(({ impact, fr, en }) => [
      { impact, locale: "fr", filename: fr },
      { impact, locale: "en", filename: en },
    ]),
  )(
    "unlocks the $impact badge and its $locale download without engagement content",
    async ({ impact, locale, filename }) => {
      jest.mocked(useLocale).mockReturnValue(locale);
      render(
        <ReduceImpactSection
          questions={[]}
          response={{ ...response, impact }}
          products={[{ name: "none", label: "No salmon", variants: [] }]}
          submissionService={async () => response}
          reduceImpact={{
            engagementsConfirmed: false,
            activeAccordionIndex: 0,
            selectedProductKey: null,
            replacementFrequencyPerYear: null,
            selectedAlternative: null,
            selectedSupplement: null,
          }}
          onSelectProduct={() => {}}
          onConfirmEngagements={() => {}}
          onFrequencyChange={() => {}}
          onConfirmFrequency={() => {}}
          onSelectAlternative={() => {}}
          onSelectSupplement={() => {}}
          onSetActiveAccordion={() => {}}
          onNewsletterInvalidEmail={() => {}}
          onNewsletterSuccess={() => {}}
          onNewsletterError={() => {}}
        />,
      );

      expect(screen.getByText("badgeQuestions.title")).toBeInTheDocument();
      expect(screen.getByText("reduceImpact.title")).toHaveClass("hidden");
      expect(
        screen.getByText("reduceImpact.step1.title").closest(".grid"),
      ).toHaveClass("hidden");
      expect(screen.queryByTestId("impact-calculator")).toBeNull();
      expect(
        screen.queryByRole("img", { name: `badges.${impact}.title` }),
      ).toBeNull();
      expect(
        screen.queryByRole("link", { name: "badgeQuestions.share" }),
      ).toBeNull();

      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: "badgeQuestions.button" }),
        );
      });

      expect(
        screen.getByRole("img", { name: `badges.${impact}.title` }),
      ).toHaveAttribute(
        "data-src",
        `/site/images/calculator/badges/${impact}.svg`,
      );
      if (impact === "neutral") {
        expect(
          screen.getByRole("img", { name: "badges.neutral.title" }),
        ).toHaveAttribute("data-width", "212");
        expect(
          screen.getByRole("img", { name: "badges.neutral.title" }),
        ).toHaveAttribute("data-height", "361");
      }
      const download = screen.getByRole("link", {
        name: "badgeQuestions.share",
      });
      const assetPath = `/site/images/calculator/download-badges-${locale}/${filename}`;
      expect(download).toHaveAttribute(
        "href",
        `/site/images/calculator/download-badges-${locale}/${encodeURIComponent(filename)}`,
      );
      expect(download).toHaveAttribute("download", filename);
      expect(existsSync(path.join(process.cwd(), "public", assetPath))).toBe(
        true,
      );
      expect(screen.queryByText("engagements.impactEqual")).toBeNull();
      expect(screen.queryByText("engagements.impactChanged")).toBeNull();
    },
  );
});

describe("ReduceImpactSection engagement badge download", () => {
  it.each([
    { locale: "fr", filename: "Grand.e_saumon.e.jpg" },
    { locale: "en", filename: "Great_Salmon.jpg" },
  ])(
    "downloads the recalculated badge in $locale rather than the initial badge",
    async ({ locale, filename }) => {
      jest.useFakeTimers();
      useLocale.mockReturnValue(locale);

      try {
        const onConfirmEngagements = jest.fn();
        const props = {
          questions: [],
          response: { ...response, impact: "high" as const },
          products: [{ name: "salmon", label: "Salmon", variants: [] }],
          submissionService: async () => ({
            ...response,
            impact: "low" as const,
          }),
          reduceImpact: {
            engagementsConfirmed: false,
            activeAccordionIndex: null,
            selectedProductKey: "salmon",
            replacementFrequencyPerYear: 1,
            selectedAlternative: "algae",
            selectedSupplement: "chiaSeeds",
          },
          onSelectProduct: jest.fn(),
          onConfirmEngagements,
          onFrequencyChange: jest.fn(),
          onConfirmFrequency: jest.fn(),
          onSelectAlternative: jest.fn(),
          onSelectSupplement: jest.fn(),
          onSetActiveAccordion: jest.fn(),
          onNewsletterInvalidEmail: jest.fn(),
          onNewsletterSuccess: jest.fn(),
          onNewsletterError: jest.fn(),
        };
        const { rerender } = render(<ReduceImpactSection {...props} />);

        await act(async () => {
          fireEvent.click(
            screen.getByRole("button", {
              name: "reduceImpact.recalculate.button",
            }),
          );
          await jest.advanceTimersByTimeAsync(1000);
        });

        expect(
          screen.queryByRole("link", { name: "badgeQuestions.share" }),
        ).toBeNull();
        fireEvent.click(
          screen.getByRole("button", { name: "engagements.confirm" }),
        );
        expect(onConfirmEngagements).toHaveBeenCalledTimes(1);

        rerender(
          <ReduceImpactSection
            {...props}
            reduceImpact={{ ...props.reduceImpact, engagementsConfirmed: true }}
          />,
        );
        await act(async () => {
          fireEvent.click(
            screen.getByRole("button", { name: "badgeQuestions.button" }),
          );
        });

        expect(
          screen.getByRole("img", { name: "badges.low.title" }),
        ).toHaveAttribute("data-src", "/site/images/calculator/badges/low.svg");
        const download = screen.getByRole("link", {
          name: "badgeQuestions.share",
        });
        expect(download).toHaveAttribute("download", filename);
        expect(download).toHaveAttribute(
          "href",
          `/site/images/calculator/download-badges-${locale}/${filename}`,
        );
      } finally {
        jest.useRealTimers();
        useLocale.mockReturnValue("fr");
      }
    },
  );
});
