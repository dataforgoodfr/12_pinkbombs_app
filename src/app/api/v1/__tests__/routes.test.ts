import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import { GET as getOptions } from "../options/route";
import { POST as postSubmission } from "../submissions/route";

const optionsPayload = {
  options: {
    scenarios: [
      { label: "Initiale", code: "initial" },
      { label: "Après engagement", code: "afterCommitment" },
    ],
    impacts: [{ label: "Neutre", code: "neutral" }],
    produits: [{ label: "Filet", code: "fillet" }],
    variantes: [{ label: "Tranche", code: "tranche" }],
    frequences: [{ label: "Hebdomadaire", code: "weekly" }],
    alternatives: [{ label: "Algues", code: "algae" }],
    supplements: [{ label: "Graines de chia", code: "chiaSeeds" }],
    unites: [{ label: "Portion", code: "portion" }],
  },
};

const submissionPayload = {
  response: { impact_initial: "low" },
  consommations: [{ scenario: "initial", produit: "fillet" }],
};

const upstreamResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as Response;

const routeResponse = (body: unknown, status = 200) =>
  ({ status, json: async () => body }) as Response;

const createRequest = (body: unknown, idempotencyKey: string) =>
  ({
    headers: {
      get: (name: string) =>
        name === "Idempotency-Key" ? idempotencyKey : null,
    },
    json: async () => body,
  }) as Request;

const installFetchMock = () => {
  const fetchMock = jest.fn<typeof fetch>();
  globalThis.fetch = fetchMock;
  return fetchMock;
};

describe("Pinkbombs API routes", () => {
  const originalApiUrl = process.env.PINKBOMBS_API_BASE_URL;
  const originalFetch = globalThis.fetch;
  const originalResponse = globalThis.Response;

  beforeEach(() => {
    globalThis.Response = {
      json: (body: unknown, init?: ResponseInit) =>
        routeResponse(body, init?.status),
    } as unknown as typeof Response;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      Reflect.deleteProperty(globalThis, "fetch");
    }
    if (originalResponse) {
      globalThis.Response = originalResponse;
    } else {
      Reflect.deleteProperty(globalThis, "Response");
    }
    if (originalApiUrl === undefined) {
      delete process.env.PINKBOMBS_API_BASE_URL;
    } else {
      process.env.PINKBOMBS_API_BASE_URL = originalApiUrl;
    }
  });

  it.each([
    ["wrapped", optionsPayload],
    ["top-level", optionsPayload.options],
  ])("proxies and validates %s option data", async (_shape, payload) => {
    process.env.PINKBOMBS_API_BASE_URL = "http://localhost:8000";
    const fetchMock = installFetchMock().mockResolvedValue(
      upstreamResponse(payload),
    );

    const response = await getOptions();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(optionsPayload);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("http://localhost:8000/api/v1/options"),
      { cache: "no-store" },
    );
  });

  it.each([200, 201])(
    "forwards a valid submission and HTTP %i",
    async (status) => {
      process.env.PINKBOMBS_API_BASE_URL = "http://localhost:8000";
      const fetchMock = installFetchMock().mockResolvedValue(
        upstreamResponse({ id: 123 }, status),
      );
      const idempotencyKey = "792d7f05-9bc1-4f7e-a801-9f1b1ef44e10";
      const request = createRequest(submissionPayload, idempotencyKey);

      const response = await postSubmission(request);

      expect(response.status).toBe(status);
      expect(await response.json()).toEqual({ id: 123 });
      expect(fetchMock).toHaveBeenCalledWith(
        new URL("http://localhost:8000/api/v1/submissions"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify({
            response: { impact_initial: "low", consentement_omega3: false },
            consommations: submissionPayload.consommations,
          }),
          cache: "no-store",
        }),
      );
    },
  );

  it("rejects unknown request fields before calling the upstream API", async () => {
    process.env.PINKBOMBS_API_BASE_URL = "http://localhost:8000";
    const fetchMock = installFetchMock();
    const request = createRequest(
      {
        ...submissionPayload,
        database_id: 5,
      },
      "792d7f05-9bc1-4f7e-a801-9f1b1ef44e10",
    );

    const response = await postSubmission(request);

    expect(response.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes upstream errors without exposing provider details", async () => {
    process.env.PINKBOMBS_API_BASE_URL = "http://localhost:8000";
    installFetchMock().mockResolvedValue(
      upstreamResponse({ detail: "private database detail" }, 409),
    );
    const request = createRequest(
      submissionPayload,
      "792d7f05-9bc1-4f7e-a801-9f1b1ef44e10",
    );

    const response = await postSubmission(request);

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "Submission conflict" });
  });
});
