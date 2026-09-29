import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import type {
  CalculatorSubmissionResponse,
  CalculatorSubmissionService,
} from "../submission";
import type { UserProductConsumption } from "../types";
import { useReduceImpactFlow } from "../useReduceImpactFlow";

const response: CalculatorSubmissionResponse = {
  totalConsoInKg: 1,
  consoPerProduct: {
    salmon: { weightInKg: 1, occurrencePerYear: 52 },
  },
  impact: "medium",
};

const products: UserProductConsumption[] = [
  {
    name: "salmon",
    label: "salmon",
    frequency: "weekly",
    frequencyLabel: "times per week",
    occurrence: 1,
    variants: [],
  },
];

const createOptions = (
  overrides: Partial<Parameters<typeof useReduceImpactFlow>[0]> = {},
) => ({
  canCalculate: true,
  frequency: 4,
  isMobile: false,
  products,
  selectedProductKey: "salmon",
  submissionService: jest
    .fn<CalculatorSubmissionService>()
    .mockResolvedValue(response),
  onConfirmFrequency: jest.fn<() => void>(),
  onSelectProduct: jest.fn<(productKey: string) => void>(),
  onSelectAlternative: jest.fn<(alternative: string) => void>(),
  onSelectSupplement: jest.fn<(supplement: string) => void>(),
  onSetActiveAccordion: jest.fn<(index: 0 | 1 | 2 | 3 | null) => void>(),
  ...overrides,
});

describe("useReduceImpactFlow", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("delays product selection and commits only the latest choice", async () => {
    jest.useFakeTimers();
    const options = createOptions();
    const { result } = renderHook(() => useReduceImpactFlow(options));

    act(() => result.current.selectProductWithDelay("first"));
    expect(result.current.pendingProductKey).toBe("first");

    act(() => jest.advanceTimersByTime(1000));
    act(() => result.current.selectProductWithDelay("salmon"));
    await act(async () => jest.advanceTimersByTimeAsync(1499));
    expect(options.onSelectProduct).not.toHaveBeenCalled();

    await act(async () => jest.advanceTimersByTimeAsync(1));
    expect(options.onSelectProduct).toHaveBeenCalledWith("salmon");
    expect(options.onSetActiveAccordion).toHaveBeenCalledWith(1);
    expect(result.current.pendingProductKey).toBeNull();
  });

  it("advances through the alternative and supplement steps after their delays", async () => {
    jest.useFakeTimers();
    const options = createOptions();
    const { result } = renderHook(() => useReduceImpactFlow(options));

    act(() => result.current.selectAlternativeWithDelay("algae"));
    await act(async () => jest.advanceTimersByTimeAsync(1500));
    expect(options.onSelectAlternative).toHaveBeenCalledWith("algae");
    expect(options.onSetActiveAccordion).toHaveBeenLastCalledWith(3);

    act(() => result.current.selectSupplementWithDelay("chiaSeeds"));
    await act(async () => jest.advanceTimersByTimeAsync(1500));
    expect(options.onSelectSupplement).toHaveBeenCalledWith("chiaSeeds");
    expect(options.onSetActiveAccordion).toHaveBeenLastCalledWith(null);
  });

  it("clears pending selections when unmounted", () => {
    jest.useFakeTimers();
    const options = createOptions();
    const { result, unmount } = renderHook(() => useReduceImpactFlow(options));

    act(() => result.current.selectAlternativeWithDelay("algae"));
    unmount();
    jest.advanceTimersByTime(1500);

    expect(options.onSelectAlternative).not.toHaveBeenCalled();
    expect(options.onSetActiveAccordion).not.toHaveBeenCalled();
  });

  it("shows loading while recalculating and stores a successful response", async () => {
    jest.useFakeTimers();
    const options = createOptions();
    const { result } = renderHook(() => useReduceImpactFlow(options));
    let calculation: Promise<void>;

    act(() => {
      calculation = result.current.calculateNewImpact();
    });

    expect(result.current.isCalculating).toBe(true);
    expect(options.submissionService).toHaveBeenCalledWith({
      products: [
        expect.objectContaining({
          name: "salmon",
          occurrence: 4,
          frequency: "otherYearly",
        }),
      ],
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
      await calculation;
    });

    expect(result.current.isCalculating).toBe(false);
    expect(result.current.newResponse).toEqual(response);
    expect(result.current.calculationError).toBeNull();
  });

  it("recalculates on desktop frequency confirmation but not on mobile", async () => {
    jest.useFakeTimers();
    const desktopOptions = createOptions();
    const desktop = renderHook(() => useReduceImpactFlow(desktopOptions));

    act(() => desktop.result.current.confirmFrequency());
    expect(desktopOptions.onConfirmFrequency).toHaveBeenCalledTimes(1);
    expect(desktopOptions.submissionService).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTimeAsync(1000));

    const mobileOptions = createOptions({ isMobile: true });
    const mobile = renderHook(() => useReduceImpactFlow(mobileOptions));
    act(() => mobile.result.current.confirmFrequency());

    expect(mobileOptions.onConfirmFrequency).toHaveBeenCalledTimes(1);
    expect(mobileOptions.submissionService).not.toHaveBeenCalled();
  });

  it("stores submission errors and supports email validation before showing a badge", async () => {
    jest.useFakeTimers();
    const options = createOptions({
      submissionService: jest
        .fn<CalculatorSubmissionService>()
        .mockResolvedValue("Submission failed"),
    });
    const { result } = renderHook(() => useReduceImpactFlow(options));
    let calculation: Promise<void>;

    act(() => {
      calculation = result.current.calculateNewImpact();
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
      await calculation;
    });
    expect(result.current.isCalculating).toBe(false);
    expect(result.current.calculationError).toBe("Submission failed");

    act(() => result.current.onEmailChange("not-an-email"));
    act(() => result.current.showBadge("Invalid email"));
    expect(result.current.emailError).toBe("Invalid email");
    expect(result.current.badgeVisible).toBe(false);

    act(() => result.current.onEmailChange(""));
    act(() => result.current.showBadge("Invalid email"));
    expect(result.current.badgeVisible).toBe(true);
    expect(result.current.emailError).toBeNull();
  });
});
