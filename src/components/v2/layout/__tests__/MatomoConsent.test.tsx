import { beforeEach, describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import {
  MatomoConsentProvider,
  MatomoPreferencesButton,
} from "../MatomoConsent";

describe("Matomo consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.getElementById("matomo-tag-manager")?.remove();
    delete (window as Window & { _mtm?: unknown[] })._mtm;
    delete (window as Window & { _paq?: unknown[][] })._paq;
  });

  it("does not show consent controls or load Matomo outside production", () => {
    render(
      <MatomoConsentProvider isProduction={false}>
        <MatomoPreferencesButton />
      </MatomoConsentProvider>,
    );

    expect(screen.queryByText("title")).toBeNull();
    expect(screen.queryByText("preferences")).toBeNull();
    expect(document.getElementById("matomo-tag-manager")).toBeNull();
  });

  it("loads Matomo only after acceptance and revokes consent after rejection", () => {
    render(
      <MatomoConsentProvider isProduction>
        <MatomoPreferencesButton />
      </MatomoConsentProvider>,
    );

    expect(document.getElementById("matomo-tag-manager")).toBeNull();
    fireEvent.click(screen.getByText("accept"));
    expect(
      document.getElementById("matomo-tag-manager")?.getAttribute("src"),
    ).toBe(
      "https://cdn.matomo.cloud/pinkbombs.matomo.cloud/container_C2nLYbcS.js",
    );

    fireEvent.click(screen.getByText("preferences"));
    fireEvent.click(screen.getByText("reject"));

    expect((window as Window & { _paq?: unknown[][] })._paq).toContainEqual([
      "forgetConsentGiven",
    ]);
    expect(window.localStorage.getItem("pinkbombs-analytics-consent")).toBe(
      "rejected",
    );
  });
});
