import { describe, expect, it, jest } from "@jest/globals";

import {
  buildPersistedSubmission,
  createPersistedSubmissionClient,
  type SubmissionOptions,
} from "../persistedSubmission";
import type { UserProductConsumption } from "../types";

const options: SubmissionOptions = {
  options: {
    scenarios: [
      { code: "initial", label: "Initiale" },
      { code: "afterCommitment", label: "Après engagement" },
    ],
    impacts: [
      { code: "neutral", label: "Neutre" },
      { code: "low", label: "Léger" },
      { code: "medium", label: "Moyen" },
      { code: "high", label: "Fort" },
      { code: "veryHigh", label: "Très fort" },
    ],
    produits: [
      { code: "fillet", label: "Filet ou pavé" },
      { code: "sushi", label: "Sushis" },
    ],
    variantes: [
      { code: "maki", label: "Maki" },
      { code: "nigiri", label: "Nigiri" },
    ],
    frequences: [
      { code: "weekly", label: "Hebdomadaire" },
      { code: "otherYearly", label: "Personnalisée par an" },
    ],
    alternatives: [{ code: "algae", label: "Algues" }],
    supplements: [{ code: "chiaSeeds", label: "Graines de chia" }],
    unites: [
      { code: "portion", label: "Portion" },
      { code: "piece", label: "Pièce" },
      { code: "slice", label: "Tranche" },
    ],
  },
};

const products: UserProductConsumption[] = [
  {
    name: "fillet",
    label: "filet ou pavé",
    frequency: "weekly",
    variants: [],
  },
  {
    name: "sushi",
    label: "sushis",
    frequency: "weekly",
    variants: [
      { type: "maki", count: 12 },
      { type: "nigiri", count: 6 },
    ],
  },
];

const submissionInput = {
  email: "person@example.org",
  impactInitial: "low",
  impactAfterCommitment: "neutral",
  alternative: "algae",
  supplement: "chiaSeeds",
  consentOmega3: true,
  products,
  selectedProductKey: "maki",
  replacementFrequencyPerYear: 4,
};

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as Response;

const optionsResponse = () => jsonResponse(options);

describe("buildPersistedSubmission", () => {
  it("builds strict code-based rows using calculated annual weights", () => {
    const payload = buildPersistedSubmission(submissionInput, options);

    expect(payload.response).toEqual({
      email: "person@example.org",
      impact_initial: "low",
      impact_apres_engagement: "neutral",
      alternative_choisie: "algae",
      supplement_choisi: "chiaSeeds",
      consentement_omega3: true,
    });
    expect(payload.consommations).toEqual([
      {
        scenario: "initial",
        produit: "fillet",
        frequence: "weekly",
        occurence_par_an: 52,
        quantite_par_occurrence: 1,
        unite_fr: "portion",
        poids_annuel_kg: 11.44,
      },
      {
        scenario: "initial",
        produit: "sushi",
        variante: "maki",
        frequence: "weekly",
        occurence_par_an: 52,
        quantite_par_occurrence: 12,
        unite_fr: "piece",
        poids_annuel_kg: 8.2992,
      },
      {
        scenario: "initial",
        produit: "sushi",
        variante: "nigiri",
        frequence: "weekly",
        occurence_par_an: 52,
        quantite_par_occurrence: 6,
        unite_fr: "piece",
        poids_annuel_kg: 10.92,
      },
      {
        scenario: "afterCommitment",
        produit: "sushi",
        variante: "maki",
        frequence: "otherYearly",
        occurence_par_an: 4,
        quantite_par_occurrence: 12,
        unite_fr: "piece",
        poids_annuel_kg: 0.6384,
      },
    ]);
    expect(payload.consommations).toHaveLength(4);
    expect(JSON.stringify(payload)).not.toContain("label");
  });

  it("omits an empty email and rejects codes not supplied by the API", () => {
    const payload = buildPersistedSubmission(
      { ...submissionInput, email: " " },
      options,
    );
    expect(payload.response).not.toHaveProperty("email");

    expect(() =>
      buildPersistedSubmission(
        { ...submissionInput, alternative: "french label" },
        options,
      ),
    ).toThrow("Unsupported alternatives code");
  });

  it("does not POST and reports which option code failed validation", async () => {
    const fetcher = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce(optionsResponse());
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const client = createPersistedSubmissionClient(fetcher, () =>
      crypto.randomUUID(),
    );

    const result = await client.submit({
      ...submissionInput,
      products: [{ ...products[0], frequency: "unsupportedFrequency" }],
      selectedProductKey: "fillet",
    });

    expect(result).toEqual({ success: false, error: "invalid_input" });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      "Calculator submission payload validation failed:",
      "Unsupported frequences code",
    );
    errorSpy.mockRestore();
  });
});

describe("persisted submission client", () => {
  it("sends the payload and reuses its idempotency key after a network failure", async () => {
    const fetcher = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce(optionsResponse())
      .mockRejectedValueOnce(new Error("Network failure"))
      .mockResolvedValueOnce(jsonResponse({ id: 123 }, 201));
    const client = createPersistedSubmissionClient(
      fetcher,
      () => "792d7f05-9bc1-4f7e-a801-9f1b1ef44e10",
    );

    expect(await client.submit(submissionInput)).toEqual({
      success: false,
      error: "unavailable",
    });
    expect(await client.submit(submissionInput)).toEqual({
      success: true,
      id: 123,
      replayed: false,
    });

    const firstRequest = fetcher.mock.calls[1]?.[1];
    const retryRequest = fetcher.mock.calls[2]?.[1];
    expect(firstRequest?.headers).toEqual({
      "Content-Type": "application/json",
      "Idempotency-Key": "792d7f05-9bc1-4f7e-a801-9f1b1ef44e10",
    });
    expect(retryRequest?.headers).toEqual(firstRequest?.headers);
    expect(JSON.parse(String(retryRequest?.body))).toEqual(
      buildPersistedSubmission(submissionInput, options),
    );
  });

  it.each([200, 201])("treats HTTP %i as successful", async (status) => {
    const fetcher = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce(optionsResponse())
      .mockResolvedValueOnce(jsonResponse({ id: 34 }, status));
    const client = createPersistedSubmissionClient(fetcher, () =>
      crypto.randomUUID(),
    );

    expect(await client.submit(submissionInput)).toEqual({
      success: true,
      id: 34,
      replayed: status === 200,
    });
    expect(await client.submit(submissionInput)).toEqual({
      success: true,
      id: 34,
      replayed: status === 200,
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("generates a new idempotency key when the payload changes", async () => {
    const fetcher = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce(optionsResponse())
      .mockResolvedValueOnce(jsonResponse({ id: 1 }, 201))
      .mockResolvedValueOnce(jsonResponse({ id: 2 }, 201));
    const keys = [
      "792d7f05-9bc1-4f7e-a801-9f1b1ef44e10",
      "5f31091c-885f-4217-a805-a7756e25eaca",
    ];
    const client = createPersistedSubmissionClient(
      fetcher,
      () => keys.shift()!,
    );

    await client.submit(submissionInput);
    await client.submit({ ...submissionInput, email: "other@example.org" });

    expect(fetcher.mock.calls[1]?.[1]?.headers).toEqual(
      expect.objectContaining({
        "Idempotency-Key": "792d7f05-9bc1-4f7e-a801-9f1b1ef44e10",
      }),
    );
    expect(fetcher.mock.calls[2]?.[1]?.headers).toEqual(
      expect.objectContaining({
        "Idempotency-Key": "5f31091c-885f-4217-a805-a7756e25eaca",
      }),
    );
  });

  it.each([
    [422, "invalid_input"],
    [409, "conflict"],
    [429, "rate_limited"],
    [503, "unavailable"],
  ] as const)("maps HTTP %i to %s", async (status, error) => {
    const fetcher = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce(optionsResponse())
      .mockResolvedValueOnce(
        jsonResponse({ error: "provider detail" }, status),
      );
    const client = createPersistedSubmissionClient(fetcher, () =>
      crypto.randomUUID(),
    );

    expect(await client.submit(submissionInput)).toEqual({
      success: false,
      error,
    });
  });
});
