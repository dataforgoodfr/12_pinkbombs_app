import {
  afterEach,
  beforeAll,
  describe,
  it,
  jest,
} from "@jest/globals";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import type { CalculatorSubmissionService } from "@/lib/calculator/submission";

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: jest.fn(),
  });
});

jest.mock("@/hooks/useIsMobile", () => ({ useIsMobile: () => false }));

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => <span data-testid="mock-image" />,
}));

jest.mock("next-intl", () => ({
  useTranslations: () => {
    type MockTranslate = ((
      key: string,
      values?: Record<string, string>,
    ) => string) & {
      raw: (key: string) => unknown;
      has: (key: string) => boolean;
    };
    const translate = ((key: string, values?: Record<string, string>) => {
      if (key === "modal.questions.1.title") {
        return `${values?.prefix} ${values?.label}`;
      }
      return key;
    }) as MockTranslate;
    translate.has = () => false;
    translate.raw = (key: string) =>
      key === "labels"
        ? [
            { label: "neutral", text: "Neutral", color: "green" },
            { label: "low", text: "Low", color: "yellow" },
            { label: "medium", text: "Medium", color: "magenta" },
            { label: "high", text: "High", color: "red" },
            { label: "veryHigh", text: "Very High", color: "black" },
          ]
        : [];
    return translate;
  },
}));

const { CalculatorModal } =
  jest.requireActual<typeof import("../CalculatorModal")>("../CalculatorModal");

const questions = [
  {
    title: "Which salmon products do you consume?",
    options: [
      { name: "sushi", label: "sushi", prefix: "some" },
      {
        name: "freshSalmon",
        label: "fresh salmon",
        prefix: "some",
      },
    ],
  },
  {
    title: "How often?",
    options: [{ name: "weekly", label: "once a week" }],
    subQuestions: [
      {
        name: "sushi",
        title: "How many pieces?",
        options: [
          { name: "maki", label: "maki", defaultValue: 12 },
          { name: "nigiri", label: "nigiri", defaultValue: 6 },
          { name: "sashimi", label: "sashimi", defaultValue: 0 },
        ],
      },
    ],
  },
];
const noneQuestions = [
  {
    ...questions[0],
    options: [
      ...questions[0].options,
      { name: "none", label: "Je ne consomme pas de saumon", prefix: "" },
    ],
  },
  questions[1],
];

describe("CalculatorModal", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("removes Back after confirmation and restores editing after quitting", async () => {
    const submissionService = jest
      .fn<CalculatorSubmissionService>()
      .mockResolvedValueOnce({
        totalConsoInKg: 1,
        consoPerProduct: {
          freshSalmon: { weightInKg: 1, occurrencePerYear: 52 },
        },
        impact: "low",
      })
      .mockResolvedValue({
        totalConsoInKg: 0,
        consoPerProduct: {},
        impact: "neutral",
      });
    const onClose = jest.fn();
    render(
      <CalculatorModal
        open
        questions={questions}
        onClose={onClose}
        submissionService={submissionService}
      />,
    );
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));
    fireEvent.click(await screen.findByRole("radio"));
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));
    await screen.findByText("sumUp.title");
    jest.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: "sumUp.button" }));
    await act(() => jest.advanceTimersByTimeAsync(4000));
    jest.useRealTimers();
    await screen.findByRole("button", { name: "reduceImpact.step2.title" });
    expect(screen.getByRole("backbutton")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "reduceImpact.step2.title" }),
    );
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "4" },
    });
    jest.useFakeTimers();
    fireEvent.click(
      screen.getByRole("button", { name: "reduceImpact.step2.confirm" }),
    );
    await act(() => jest.advanceTimersByTimeAsync(1000));
    fireEvent.click(document.getElementById("alternative-algae")!);
    await act(() => jest.advanceTimersByTimeAsync(1500));
    fireEvent.click(document.getElementById("supplement-chiaSeeds")!);
    await act(() => jest.advanceTimersByTimeAsync(1500));
    jest.useRealTimers();
    const confirmButtons = screen.getAllByRole("button", {
      name: "engagements.confirm",
    });
    expect(confirmButtons[1]).toBeEnabled();
    fireEvent.click(confirmButtons[1]);
    expect(screen.queryByRole("backbutton")).toBeNull();
    confirmButtons.forEach((button) => expect(button).toBeDisabled());
    expect(
      screen.getByRole("button", { name: "badgeQuestions.button" }),
    ).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "modal.quit" }));
    expect(onClose).toHaveBeenCalled();
    await screen.findByText(questions[0].title);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
    expect(screen.queryByRole("backbutton")).toBeNull();
    fireEvent.click(checkboxes[1]);
    expect(screen.getByRole("button", { name: "modal.next" })).toBeEnabled();
  });

  it("tracks completed products from frequency through summary", async () => {
    const submissionService = jest
      .fn<CalculatorSubmissionService>()
      .mockResolvedValue({
        totalConsoInKg: 0,
        consoPerProduct: {},
        impact: "neutral",
      });
    render(
      <CalculatorModal
        open
        questions={questions}
        onClose={jest.fn()}
        submissionService={submissionService}
      />,
    );

    expect(screen.queryByRole("progressbar")).toBeNull();

    screen.getAllByRole("checkbox").forEach((checkbox) => {
      fireEvent.click(checkbox);
    });
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));

    expect(screen.queryByText("How many pieces?")).toBeNull();

    let progress = await screen.findByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("0");
    expect(progress.getAttribute("aria-valuemax")).toBe("2");
    expect(
      Array.from(progress.querySelectorAll("ellipse"), (dot) =>
        dot.getAttribute("fill"),
      ),
    ).toEqual(["white", "white"]);

    fireEvent.click(await screen.findByRole("radio"));

    expect(await screen.findByText("How many pieces?")).not.toBeNull();
    expect(screen.queryByRole("radio")).toBeNull();
    progress = screen.getByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("0");

    fireEvent.click(screen.getByRole("backbutton"));
    await waitFor(() => {
      expect(screen.getByText("some sushi")).not.toBeNull();
      expect(screen.getByRole("radio")).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));
    await waitFor(() => {
      expect(screen.getByText("How many pieces?")).not.toBeNull();
    });

    expect(screen.queryByRole("radio")).toBeNull();
    progress = screen.getByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("0");
    expect(
      Array.from(progress.querySelectorAll("ellipse"), (dot) =>
        dot.getAttribute("fill"),
      ),
    ).toEqual(["white", "white"]);

    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));
    await waitFor(() => {
      expect(screen.getByText("some fresh salmon")).not.toBeNull();
    });

    progress = screen.getByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("1");
    expect(
      Array.from(progress.querySelectorAll("ellipse"), (dot) =>
        dot.getAttribute("fill"),
      ),
    ).toEqual(["#FFD4D4", "white"]);

    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));

    expect(await screen.findByText("sumUp.title")).not.toBeNull();
    progress = screen.getByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("2");
    expect(
      Array.from(progress.querySelectorAll("ellipse"), (dot) =>
        dot.getAttribute("fill"),
      ),
    ).toEqual(["#FFD4D4", "#FFD4D4"]);
    jest.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: "sumUp.button" }));
    await act(() => jest.advanceTimersByTimeAsync(4000));
    jest.useRealTimers();

    await waitFor(() => {
      expect(screen.getAllByText("result.title").length).toBeGreaterThan(0);
      expect(screen.queryByRole("progressbar")).toBeNull();
      expect(submissionService).toHaveBeenCalledWith(
        expect.objectContaining({ products: expect.any(Array) }),
      );
    });
  });

  it("submits none after one second and allows going back through summary to selection", async () => {
    jest.useFakeTimers();
    const submissionService = jest
      .fn<CalculatorSubmissionService>()
      .mockResolvedValue({
        totalConsoInKg: 0,
        consoPerProduct: {},
        impact: "neutral",
      });
    render(
      <CalculatorModal
        open
        questions={noneQuestions}
        onClose={jest.fn()}
        submissionService={submissionService}
      />,
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Je ne consomme pas de saumon",
      }),
    );

    expect(submissionService).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "modal.next" })).toBeNull();
    await act(() => jest.advanceTimersByTimeAsync(999));
    expect(submissionService).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTimeAsync(1));
    expect(submissionService).toHaveBeenCalledWith({
      products: [expect.objectContaining({ name: "none" })],
    });
    expect(screen.queryByText("modal.questions.1.title")).toBeNull();
    expect(screen.queryByText("sumUp.title")).toBeNull();

    await act(() => jest.advanceTimersByTimeAsync(4000));
    jest.useRealTimers();
    await waitFor(() => {
      expect(screen.getAllByText("result.title").length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole("backbutton"));
    expect(await screen.findByText("sumUp.title")).not.toBeNull();
    const summaryTitle = screen.getByText("sumUp.title");
    fireEvent.click(screen.getByRole("backbutton"));
    await waitForElementToBeRemoved(summaryTitle, { timeout: 5000 });
    const noneCheckbox = await screen.findByRole(
      "checkbox",
      { name: "Je ne consomme pas de saumon" },
      { timeout: 5000 },
    );
    expect((noneCheckbox as HTMLInputElement).checked).toBe(true);
    expect(screen.queryByRole("radio")).toBeNull();

    jest.useFakeTimers();
    await act(() => jest.advanceTimersByTimeAsync(1500));
    expect(submissionService).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("checkbox", {
        name: "Je ne consomme pas de saumon",
      }),
    ).toBe(noneCheckbox);

    fireEvent.click(noneCheckbox);
    await act(() => jest.advanceTimersByTimeAsync(1000));
    expect(submissionService).toHaveBeenCalledTimes(2);
    await act(() => jest.advanceTimersByTimeAsync(4000));
  });

  it("shows the error screen when submission fails", async () => {
    const submissionService = jest
      .fn<CalculatorSubmissionService>()
      .mockResolvedValue("Submission failed");
    render(
      <CalculatorModal
        open
        questions={questions}
        onClose={jest.fn()}
        submissionService={submissionService}
      />,
    );

    screen.getAllByRole("checkbox").forEach((checkbox) => {
      fireEvent.click(checkbox);
    });
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));
    await waitFor(() => {
      expect(screen.getByRole("radio")).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));
    await waitFor(() => {
      expect(screen.getByText("How many pieces?")).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));
    await waitFor(() => {
      expect(screen.getByText("some fresh salmon")).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));

    expect(await screen.findByText("sumUp.title")).not.toBeNull();
    jest.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: "sumUp.button" }));
    await act(() => jest.advanceTimersByTimeAsync(4000));
    jest.useRealTimers();

    await waitFor(() => {
      expect(screen.getByText("error.title")).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: "error.retry" }));
    expect(await screen.findByText("sumUp.title")).not.toBeNull();
  });
});
