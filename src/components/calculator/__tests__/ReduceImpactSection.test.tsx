import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import type { CalculatorSubmissionResponse } from "@/lib/calculator/submission";

jest.mock("next-intl", () => ({
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

const response: CalculatorSubmissionResponse = {
  totalConsoInKg: 0,
  consoPerProduct: {},
  impact: "neutral",
};

describe("ReduceImpactSection Step 4 info", () => {
  it("opens and dismisses the fish oil tooltip independently of its disabled radio", () => {
    render(
      <ReduceImpactSection
        questions={[]}
        response={response}
        products={[]}
        submissionService={async () => response}
        reduceImpact={{
          activeAccordionIndex: 3,
          selectedProductKey: null,
          replacementFrequencyPerYear: null,
          selectedAlternative: null,
          selectedSupplement: null,
        }}
        onSelectProduct={() => {}}
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
  it("shows the newsletter area directly and unlocks the neutral badge without engagement content", () => {
    render(
      <ReduceImpactSection
        questions={[]}
        response={response}
        products={[{ name: "none", label: "No salmon", variants: [] }]}
        submissionService={async () => response}
        reduceImpact={{
          activeAccordionIndex: 0,
          selectedProductKey: null,
          replacementFrequencyPerYear: null,
          selectedAlternative: null,
          selectedSupplement: null,
        }}
        onSelectProduct={() => {}}
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
      screen.queryByRole("img", { name: "badges.neutral.title" }),
    ).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "badgeQuestions.button" }),
    );

    expect(
      screen.getByRole("img", { name: "badges.neutral.title" }),
    ).toHaveAttribute("data-src", "/site/images/calculator/badges/neutral.svg");
    expect(
      screen.getByRole("img", { name: "badges.neutral.title" }),
    ).toHaveAttribute("data-width", "212");
    expect(
      screen.getByRole("img", { name: "badges.neutral.title" }),
    ).toHaveAttribute("data-height", "361");
    expect(
      screen.getByRole("button", { name: "badgeQuestions.share" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("engagements.impactEqual")).toBeNull();
    expect(screen.queryByText("engagements.impactChanged")).toBeNull();
  });
});
