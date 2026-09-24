import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import type { CalculatorSubmissionService } from "../submission";

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
    };
    const translate = ((key: string, values?: Record<string, string>) => {
      if (key === "modal.questions.1.title") {
        return `${values?.prefix} ${values?.label}`;
      }
      return key;
    }) as MockTranslate;
    translate.raw = () => [];
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

describe("CalculatorModal", () => {
  it("tracks completed products from frequency through summary", async () => {
    const submissionService = jest
      .fn<CalculatorSubmissionService>()
      .mockResolvedValue({ result: null });
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
    ).toEqual(["#E82D04", "white"]);

    fireEvent.click(screen.getByRole("radio"));
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));

    expect(await screen.findByText("sumUp.title")).not.toBeNull();
    progress = screen.getByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("2");
    expect(
      Array.from(progress.querySelectorAll("ellipse"), (dot) =>
        dot.getAttribute("fill"),
      ),
    ).toEqual(["#E82D04", "#E82D04"]);
    fireEvent.click(screen.getByRole("button", { name: "sumUp.button" }));

    await waitFor(() => {
      expect(screen.getByText("loading.title")).not.toBeNull();
      expect(screen.queryByRole("progressbar")).toBeNull();
      expect(submissionService).toHaveBeenCalledWith(
        expect.objectContaining({ products: expect.any(Array) }),
      );
    });
  });
});
