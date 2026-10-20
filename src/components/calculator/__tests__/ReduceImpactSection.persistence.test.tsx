import { afterEach, beforeAll, beforeEach, jest } from "@jest/globals";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import * as React from "react";

import {
  calculatorReducer,
  INITIAL_CALCULATOR_STATE,
} from "@/lib/calculator/state";
import type { CalculatorSubmissionResponse } from "@/lib/calculator/submission";
import type { CalculatorSubmissionService } from "@/lib/calculator/submission";
import {
  CalculatorStep,
  type UserProductConsumption,
} from "@/lib/calculator/types";

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
  useLocale: () => "fr",
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

jest.mock("@/hooks/useIsMobile", () => ({ useIsMobile: jest.fn(() => false) }));
jest.mock("@/hooks/useNewsletterSubscription", () => ({
  useNewsletterSubscription: () => ({
    subscribe: async () => ({ success: true }),
    isSubmitting: false,
  }),
}));
jest.mock("@/lib/calculator/persistedSubmission", () => ({
  persistCalculatorSubmission: jest.fn(),
}));
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
const { useIsMobile } = jest.requireMock<typeof import("@/hooks/useIsMobile")>(
  "@/hooks/useIsMobile",
);
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
  jest.mocked(useIsMobile).mockReturnValue(false);
  jest.useRealTimers();
});

const renderNoConsumption = () =>
  render(
    <ReduceImpactSection
      questions={[]}
      response={{ totalConsoInKg: 0, consoPerProduct: {}, impact: "neutral" }}
      products={[{ name: "none", label: "No salmon", variants: [] }]}
      submissionService={jest.fn<CalculatorSubmissionService>()}
      reduceImpact={{
        engagementsConfirmed: false,
        activeAccordionIndex: null,
        selectedProductKey: null,
        replacementFrequencyPerYear: null,
        selectedAlternative: null,
        selectedSupplement: null,
      }}
      onSelectProduct={jest.fn()}
      onConfirmEngagements={jest.fn()}
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
  it.each([false, true])(
    "locks the calculated engagement and persists its original frequency on mobile=%s",
    async (isMobile) => {
      jest.useFakeTimers();
      jest.mocked(useIsMobile).mockReturnValue(isMobile);
      const actualFlow = jest.requireActual<
        typeof import("@/lib/calculator/useReduceImpactFlow")
      >("@/lib/calculator/useReduceImpactFlow").useReduceImpactFlow;
      jest.mocked(useReduceImpactFlow).mockImplementation(actualFlow);
      jest
        .mocked(persistCalculatorSubmission)
        .mockResolvedValue({ success: true, id: 1, replayed: false });
      const submissionService = jest
        .fn<CalculatorSubmissionService>()
        .mockResolvedValue({
          totalConsoInKg: 0,
          consoPerProduct: {},
          impact: "neutral",
        });
      const Harness = () => {
        const [state, dispatch] = React.useReducer(calculatorReducer, {
          ...INITIAL_CALCULATOR_STATE,
          step: CalculatorStep.Result,
          products,
          calculationResponse: originalResponse,
          reduceImpact: {
            engagementsConfirmed: false,
            activeAccordionIndex: 1,
            selectedProductKey: "fillet",
            replacementFrequencyPerYear: 4,
            selectedAlternative: "algae",
            selectedSupplement: "chiaSeeds",
          },
        });
        return (
          <ReduceImpactSection
            questions={[]}
            response={originalResponse}
            products={state.products}
            submissionService={submissionService}
            reduceImpact={state.reduceImpact}
            onConfirmEngagements={() =>
              dispatch({ type: "confirmEngagements" })
            }
            onSelectProduct={(productKey) =>
              dispatch({ type: "selectReplacementProduct", productKey })
            }
            onFrequencyChange={(occurrencePerYear) =>
              dispatch({ type: "setReplacementFrequency", occurrencePerYear })
            }
            onConfirmFrequency={() =>
              dispatch({ type: "confirmReplacementFrequency" })
            }
            onSelectAlternative={(alternative) =>
              dispatch({ type: "selectAlternative", alternative })
            }
            onSelectSupplement={(supplement) =>
              dispatch({ type: "selectSupplement", supplement })
            }
            onSetActiveAccordion={(index) =>
              dispatch({ type: "setActiveAccordionIndex", index })
            }
            onNewsletterInvalidEmail={jest.fn()}
            onNewsletterSuccess={jest.fn()}
            onNewsletterError={jest.fn()}
          />
        );
      };
      render(<Harness />);
      fireEvent.click(
        screen.getByRole("button", { name: "reduceImpact.recalculate.button" }),
      );
      await act(() => jest.advanceTimersByTimeAsync(1000));
      jest.useRealTimers();
      const confirmButtons = screen.getAllByRole("button", {
        name: "engagements.confirm",
      });
      expect(confirmButtons).toHaveLength(2);
      confirmButtons.forEach((button) => expect(button).toBeEnabled());
      fireEvent.click(confirmButtons[isMobile ? 0 : 1]);
      confirmButtons.forEach((button) => expect(button).toBeDisabled());
      for (const step of [1, 2, 3, 4]) {
        const header = screen.getByRole("button", {
          name: `reduceImpact.step${step}.title`,
        });
        expect(header).toBeDisabled();
        expect(header).toHaveAttribute("aria-expanded", "false");
        fireEvent.click(header);
        expect(header).toHaveAttribute("aria-expanded", "false");
      }
      const frequencyInput = document.getElementById("replacement-frequency")!;
      expect(frequencyInput).toBeDisabled();
      fireEvent.change(frequencyInput, { target: { value: "20" } });
      expect(frequencyInput).toHaveValue(4);
      expect(
        screen.getByRole("button", { name: "reduceImpact.recalculate.button" }),
      ).toBeDisabled();
      document
        .querySelectorAll('input[type="radio"]')
        .forEach((radio) => expect(radio).toBeDisabled());
      fireEvent.click(confirmButtons[0]);
      expect(submissionService).toHaveBeenCalledTimes(1);
      const emailInput = screen.getByRole("textbox", {
        name: "badgeQuestions.email",
      });
      expect(emailInput).toBeEnabled();
      fireEvent.change(emailInput, { target: { value: "person@example.org" } });
      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: "badgeQuestions.button" }),
        );
      });
      expect(
        screen.queryByRole("button", { name: "badgeQuestions.button" }),
      ).toBeNull();
      expect(screen.getByText("badgeQuestions.title")).not.toBeVisible();
      expect(screen.getByText("badgeQuestions.unlockedBadge")).toBeVisible();
      expect(persistCalculatorSubmission).toHaveBeenCalledWith(
        expect.objectContaining({
          impactInitial: "low",
          impactAfterCommitment: "neutral",
          replacementFrequencyPerYear: 4,
          selectedProductKey: "fillet",
          alternative: "algae",
          supplement: "chiaSeeds",
        }),
      );
      expect(submissionService).toHaveBeenCalledWith({
        products: [expect.objectContaining({ occurrence: 4 })],
      });
    },
  );

  it.each([
    { isCalculating: true },
    { pendingProductKey: "fillet" },
    { pendingAlternative: "shellfish" },
    { pendingSupplement: "nut" },
  ])("prevents confirmation while work is pending: %j", (pending) => {
    jest
      .mocked(useReduceImpactFlow)
      .mockImplementation((input) => ({ ...defaultFlow(input), ...pending }));
    const onConfirmEngagements = jest.fn();
    render(
      <ReduceImpactSection
        questions={[]}
        response={originalResponse}
        products={products}
        submissionService={jest.fn<CalculatorSubmissionService>()}
        reduceImpact={{
          engagementsConfirmed: false,
          activeAccordionIndex: 1,
          selectedProductKey: "fillet",
          replacementFrequencyPerYear: 4,
          selectedAlternative: "algae",
          selectedSupplement: "chiaSeeds",
        }}
        onConfirmEngagements={onConfirmEngagements}
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
    const buttons = screen.getAllByRole("button", {
      name: "engagements.confirm",
    });
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
      fireEvent.click(button);
    });
    expect(onConfirmEngagements).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "persists no consumption without selections with consent %s",
    async (consent) => {
      const onEmailChange = jest.fn();
      jest.mocked(useReduceImpactFlow).mockImplementation((input) => ({
        ...defaultFlow(input),
        newResponse: null,
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
        screen.queryByRole("button", { name: "badgeQuestions.button" }),
      ).toBeNull();
      expect(screen.getByText("badgeQuestions.title")).not.toBeVisible();

      await act(async () => {
        resolvePersistence({ success: true, id: 1, replayed: false });
        await pendingPersistence;
      });
      await waitFor(() => expect(onEmailChange).toHaveBeenCalledWith(""));
      expect(
        screen.queryByRole("button", { name: "badgeQuestions.button" }),
      ).toBeNull();
      expect(persistCalculatorSubmission).toHaveBeenCalledTimes(1);
    },
  );

  it("retains the non-consumer email when persistence fails", async () => {
    const onEmailChange = jest.fn();
    jest.mocked(useReduceImpactFlow).mockImplementation((input) => ({
      ...defaultFlow(input),
      newResponse: null,
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
    expect(
      screen.queryByRole("button", { name: "badgeQuestions.button" }),
    ).toBeNull();
    expect(screen.getByText("badgeQuestions.title")).not.toBeVisible();
  });

  it("hides the yellow form when showing the badge without an email", async () => {
    jest.mocked(useReduceImpactFlow).mockImplementation((input) => ({
      ...defaultFlow(input),
      newResponse: null,
      email: "",
    }));
    jest
      .mocked(persistCalculatorSubmission)
      .mockResolvedValue({ success: true, id: 1, replayed: false });
    renderNoConsumption();
    const badgeButton = screen.getByRole("button", {
      name: "badgeQuestions.button",
    });
    await act(async () => fireEvent.click(badgeButton));
    expect(badgeButton).not.toBeVisible();
    expect(screen.getByText("badgeQuestions.title")).not.toBeVisible();
    expect(screen.getByText("badgeQuestions.unlockedBadge")).toBeVisible();
    fireEvent.click(badgeButton);
    expect(persistCalculatorSubmission).toHaveBeenCalledTimes(1);
  });

  it("does not persist a non-consumer response with invalid email", () => {
    jest.mocked(useReduceImpactFlow).mockImplementation((input) => ({
      ...defaultFlow(input),
      newResponse: null,
      validateEmail: () => false,
    }));
    renderNoConsumption();
    fireEvent.click(
      screen.getByRole("button", { name: "badgeQuestions.button" }),
    );
    expect(persistCalculatorSubmission).not.toHaveBeenCalled();
    expect(screen.queryByText("badgeQuestions.unlockedBadge")).toBeNull();
    expect(screen.getByText("badgeQuestions.title")).toBeVisible();
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
          engagementsConfirmed: true,
          activeAccordionIndex: null,
          selectedProductKey: "fillet",
          replacementFrequencyPerYear: 4,
          selectedAlternative: "algae",
          selectedSupplement: "chiaSeeds",
        }}
        onSelectProduct={jest.fn()}
        onConfirmEngagements={jest.fn()}
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
