import { afterEach, beforeAll, beforeEach, jest } from "@jest/globals";
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

const defaultFlow = jest.mocked(useReduceImpactFlow).getMockImplementation()!;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.mocked(useReduceImpactFlow).mockImplementation(defaultFlow);
});

const renderNoConsumption = () =>
  render(
    <ReduceImpactSection
      questions={[]}
      response={{ totalConsoInKg: 0, consoPerProduct: {}, impact: "neutral" }}
      products={[{ name: "none", label: "No salmon", variants: [] }]}
      submissionService={jest.fn<CalculatorSubmissionService>()}
      reduceImpact={{
        activeAccordionIndex: null,
        selectedProductKey: null,
        replacementFrequencyPerYear: null,
        selectedAlternative: null,
        selectedSupplement: null,
      }}
      onSelectProduct={jest.fn()}
      onFrequencyChange={jest.fn()}
      onConfirmFrequency={jest.fn()}
      onSelectAlternative={jest.fn()}
      onSelectSupplement={jest.fn()}
      onSetActiveAccordion={jest.fn()}
      onNewsletterInvalidEmail={jest.fn()}
      onNewsletterSuccess={jest.fn()}
      onNewsletterError={jest.fn()}
    />,
  );

describe("ReduceImpactSection persistence", () => {
  it.each([true, false])(
    "persists no consumption without selections with consent %s",
    async (consent) => {
      const onEmailChange = jest.fn();
      jest.mocked(useReduceImpactFlow).mockImplementation((input) => ({
        ...defaultFlow(input),
        newResponse: null,
        engagementsConfirmed: false,
        hasOmega3Consent: consent,
        onEmailChange,
      }));
      let resolvePersistence!: (value: {
        success: true;
        id: number;
        replayed: boolean;
      }) => void;
      const pendingPersistence = new Promise<{
        success: true;
        id: number;
        replayed: boolean;
      }>((resolve) => {
        resolvePersistence = resolve;
      });
      jest
        .mocked(persistCalculatorSubmission)
        .mockReturnValue(pendingPersistence);
      renderNoConsumption();

      fireEvent.click(
        screen.getByRole("button", { name: "badgeQuestions.button" }),
      );

      expect(screen.getByText("badgeQuestions.unlockedBadge")).not.toBeNull();
      expect(persistCalculatorSubmission).toHaveBeenCalledTimes(1);
      expect(persistCalculatorSubmission).toHaveBeenCalledWith({
        mode: "noConsumption",
        email: "person@example.org",
        impactInitial: "neutral",
        consentOmega3: consent,
        products: [{ name: "none", label: "No salmon", variants: [] }],
      });
      expect(onEmailChange).not.toHaveBeenCalledWith("");
      expect(
        screen.getByRole("button", { name: "badgeQuestions.button" }),
      ).toBeDisabled();

      await act(async () => {
        resolvePersistence({ success: true, id: 1, replayed: false });
        await pendingPersistence;
      });
      await waitFor(() => expect(onEmailChange).toHaveBeenCalledWith(""));
    },
  );

  it("retains the non-consumer email when persistence fails", async () => {
    const onEmailChange = jest.fn();
    jest.mocked(useReduceImpactFlow).mockImplementation((input) => ({
      ...defaultFlow(input),
      newResponse: null,
      engagementsConfirmed: false,
      onEmailChange,
    }));
    jest
      .mocked(persistCalculatorSubmission)
      .mockResolvedValue({ success: false, error: "unavailable" });
    renderNoConsumption();
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "badgeQuestions.button" }),
      );
    });
    expect(persistCalculatorSubmission).toHaveBeenCalledTimes(1);
    expect(onEmailChange).not.toHaveBeenCalledWith("");
    expect(screen.getByText("badgeQuestions.unlockedBadge")).not.toBeNull();
  });

  it("does not persist a non-consumer response with invalid email", () => {
    jest.mocked(useReduceImpactFlow).mockImplementation((input) => ({
      ...defaultFlow(input),
      newResponse: null,
      engagementsConfirmed: false,
      validateEmail: () => false,
    }));
    renderNoConsumption();
    fireEvent.click(
      screen.getByRole("button", { name: "badgeQuestions.button" }),
    );
    expect(persistCalculatorSubmission).not.toHaveBeenCalled();
    expect(screen.queryByText("badgeQuestions.unlockedBadge")).toBeNull();
  });

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
