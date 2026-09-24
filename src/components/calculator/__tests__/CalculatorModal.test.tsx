import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { CalculatorModal } from "../CalculatorModal";

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

const questions = [
  {
    title: "Which salmon products do you consume?",
    options: [{ name: "sushi", label: "sushi", prefix: "some" }],
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
  it("moves from product selection to summary and loading", async () => {
    const submissionService = jest.fn().mockResolvedValue({ result: null });
    render(
      <CalculatorModal
        open
        questions={questions}
        onClose={jest.fn()}
        submissionService={submissionService}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));

    expect(screen.queryByText("How many pieces?")).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole("radio"));

    expect(await screen.findByText("How many pieces?")).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(await screen.findByRole("radio")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));
    await screen.findByText("How many pieces?");
    fireEvent.click(screen.getByRole("button", { name: "modal.next" }));

    expect(await screen.findByText("sumUp.title")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "sumUp.button" }));

    await waitFor(() => {
      expect(screen.getByText("loading.title")).toBeInTheDocument();
      expect(submissionService).toHaveBeenCalledWith(
        expect.objectContaining({ products: expect.any(Array) }),
      );
    });
  });
});
