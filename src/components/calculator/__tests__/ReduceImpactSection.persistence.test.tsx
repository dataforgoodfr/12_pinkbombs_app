import { beforeAll, jest } from "@jest/globals";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import * as React from "react";

import type { CalculatorSubmissionResponse } from "@/lib/calculator/submission";
import type { CalculatorSubmissionService } from "@/lib/calculator/submission";
import type { UserProductConsumption } from "@/lib/calculator/types";

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: jest.fn(),
  });
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => <span data-testid="mock-image" />,
}));

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const translate = ((key: string) => key) as ((key: string) => string) & {
      raw: (key: string) => unknown;
      has: (key: string) => boolean;
    };
    translate.has = (key: string) =>
      key === "badges.neutral.width" || key === "badges.neutral.height";
    translate.raw = (key: string) => {
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

jest.mock("@/lib/calculator/useReduceImpactFlow", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  return {
    useReduceImpactFlow: jest.fn(() => {
      const [badgeVisible, setBadgeVisible] = React.useState(false);
      return {
        newResponse: {
          totalConsoInKg: 0,
          consoPerProduct: {},
          impact: "neutral",
        },
        isCalculating: false,
        calculationError: null,
        engagementsConfirmed: true,
        setEngagementsConfirmed: jest.fn(),
        hasOmega3Consent: false,
        setHasOmega3Consent: jest.fn(),
        email: "person@example.org",
        emailError: null,
        onEmailChange: jest.fn(),
        validateEmail: () => true,
        badgeVisible,
        showBadge: () => setBadgeVisible(true),
        badgeQuestionsRef: { current: null },
        badgeRef: { current: null },
        newResponseRef: { current: null },
        pendingProductKey: null,
        pendingAlternative: null,
        pendingSupplement: null,
        calculateNewImpact: jest.fn(),
        confirmFrequency: jest.fn(),
        selectProductWithDelay: jest.fn(),
        selectAlternativeWithDelay: jest.fn(),
        selectSupplementWithDelay: jest.fn(),
      };
    }),
  };
});

jest.mock("@/hooks/useIsMobile", () => ({ useIsMobile: () => false }));
jest.mock("@/hooks/useNewsletterSubscription", () => ({
  useNewsletterSubscription: () => ({
    subscribe: async () => ({ success: true }),
    isSubmitting: false,
  }),
}));
jest.mock("@/lib/calculator/persistedSubmission", () => ({
  persistCalculatorSubmission: jest.fn(),
}));
jest.mock("../DesktopImpactPanel", () => ({ DesktopImpactPanel: () => null }));
jest.mock("../../v2/Calculator", () => ({
  __esModule: true,
  default: () => null,
}));

const { persistCalculatorSubmission } = jest.requireMock<
  typeof import("@/lib/calculator/persistedSubmission")
>("@/lib/calculator/persistedSubmission");
const { useReduceImpactFlow } = jest.requireMock<
  typeof import("@/lib/calculator/useReduceImpactFlow")
>("@/lib/calculator/useReduceImpactFlow");
const { ReduceImpactSection } = jest.requireActual<
  typeof import("../ReduceImpactSection")
>("../ReduceImpactSection");

const originalResponse: CalculatorSubmissionResponse = {
  totalConsoInKg: 1,
  consoPerProduct: {
    fillet: { weightInKg: 1, occurrencePerYear: 52 },
  },
  impact: "low",
};

const products: UserProductConsumption[] = [
  { name: "fillet", label: "fillet", frequency: "weekly", variants: [] },
];

describe("ReduceImpactSection persistence", () => {
  it("shows the badge immediately and preserves email when persistence fails", async () => {
    let resolvePersistence:
      | ((value: { success: false; error: "unavailable" }) => void)
      | undefined;
    const pendingPersistence = new Promise<{
      success: false;
      error: "unavailable";
    }>((resolve) => {
      resolvePersistence = resolve;
    });
    const persistMock = jest.mocked(persistCalculatorSubmission);
    persistMock.mockReturnValue(pendingPersistence);

    const onNewsletterSuccess = jest.fn();
    render(
      <ReduceImpactSection
        questions={[]}
        response={originalResponse}
        products={products}
        submissionService={jest.fn<CalculatorSubmissionService>()}
        reduceImpact={{
          activeAccordionIndex: null,
          selectedProductKey: "fillet",
          replacementFrequencyPerYear: 4,
          selectedAlternative: "algae",
          selectedSupplement: "chiaSeeds",
        }}
        onSelectProduct={jest.fn()}
        onFrequencyChange={jest.fn()}
        onConfirmFrequency={jest.fn()}
        onSelectAlternative={jest.fn()}
        onSelectSupplement={jest.fn()}
        onSetActiveAccordion={jest.fn()}
        onNewsletterInvalidEmail={jest.fn()}
        onNewsletterSuccess={onNewsletterSuccess}
        onNewsletterError={jest.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "badgeQuestions.button" }),
    );

    expect(
      await screen.findByText("badgeQuestions.unlockedBadge"),
    ).not.toBeNull();
    expect(persistMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "person@example.org",
        impactInitial: "low",
        impactAfterCommitment: "neutral",
        alternative: "algae",
        supplement: "chiaSeeds",
        consentOmega3: false,
      }),
    );
    await waitFor(() => expect(onNewsletterSuccess).toHaveBeenCalled());

    await act(async () => {
      resolvePersistence?.({ success: false, error: "unavailable" });
      await pendingPersistence;
    });

    const hookResult = jest.mocked(useReduceImpactFlow).mock.results[0]
      ?.value as ReturnType<typeof useReduceImpactFlow> | undefined;
    expect(hookResult?.onEmailChange).not.toHaveBeenCalledWith("");
    expect(screen.getByText("badgeQuestions.unlockedBadge")).not.toBeNull();
  });
});
