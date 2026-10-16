/* eslint-disable no-console */

import { z } from "zod";

import { getProductWeightEntries } from "./computeConsumption";
import { FREQUENCY } from "./constants";
import type { UserProductConsumption } from "./types";

const optionSchema = z.object({
  code: z.string().min(1),
  label: z.string(),
});

export const submissionOptionsSchema = z.object({
  options: z.object({
    scenarios: z.array(optionSchema),
    impacts: z.array(optionSchema),
    produits: z.array(optionSchema),
    variantes: z.array(optionSchema),
    frequences: z.array(optionSchema),
    alternatives: z.array(optionSchema),
    supplements: z.array(optionSchema),
    unites: z.array(optionSchema),
  }),
});

export type SubmissionOptions = z.infer<typeof submissionOptionsSchema>;

const numericFieldSchema = z
  .number()
  .finite()
  .min(0)
  .refine((value) => value < 1e20 && Number(value.toFixed(10)) === value);

const responseSchema = z
  .object({
    email: z.string().email().optional(),
    impact_initial: z.string().optional(),
    impact_apres_engagement: z.string().optional(),
    alternative_choisie: z.string().optional(),
    supplement_choisi: z.string().optional(),
    consentement_omega3: z.boolean().default(false),
  })
  .strict();

const consumptionSchema = z
  .object({
    scenario: z.string().min(1),
    produit: z.string().optional(),
    variante: z.string().optional(),
    frequence: z.string().optional(),
    occurence_par_an: numericFieldSchema.optional(),
    quantite_par_occurrence: numericFieldSchema.optional(),
    unite_fr: z.string().optional(),
    poids_annuel_kg: numericFieldSchema.optional(),
  })
  .strict();

export const persistedSubmissionSchema = z
  .object({
    response: responseSchema,
    consommations: z.array(consumptionSchema).max(100),
  })
  .strict()
  .refine(
    ({ response, consommations }) =>
      consommations.length > 0 ||
      (response.impact_initial === "neutral" &&
        response.impact_apres_engagement === undefined &&
        response.alternative_choisie === undefined &&
        response.supplement_choisi === undefined),
    {
      message:
        "Empty consumption requires a neutral response without engagements",
    },
  );

export type PersistedSubmission = z.infer<typeof persistedSubmissionSchema>;

interface PersistedSubmissionBase {
  email: string;
  impactInitial: string;
  consentOmega3: boolean;
  products: UserProductConsumption[];
}

export type PersistedSubmissionInput = PersistedSubmissionBase &
  (
    | {
        mode: "noConsumption";
        impactAfterCommitment?: never;
        alternative?: never;
        supplement?: never;
        selectedProductKey?: never;
        replacementFrequencyPerYear?: never;
      }
    | {
        mode: "engagement";
        impactAfterCommitment: string;
        alternative: string;
        supplement: string;
        selectedProductKey: string;
        replacementFrequencyPerYear: number;
      }
  );

const roundedApiNumber = (value: number) => Number(value.toFixed(10));

const requireOptionCode = (
  options: SubmissionOptions,
  group: keyof SubmissionOptions["options"],
  code: string | undefined,
) => {
  if (!code || !options.options[group].some((option) => option.code === code)) {
    throw new Error(`Unsupported ${group} code`);
  }

  return code;
};

const getUnitCode = (productName: string, variantType?: string) => {
  if (variantType === "tranche" || productName === "smokedSalmon") {
    return "slice";
  }
  if (variantType || productName === "sushi") {
    return "piece";
  }
  return "portion";
};

const buildConsumptionRows = (
  products: UserProductConsumption[],
  scenario: string,
  options: SubmissionOptions,
) =>
  products.flatMap((product) => {
    if (product.name === "none") return [];

    const productCode = requireOptionCode(options, "produits", product.name);
    const frequencyCode = requireOptionCode(
      options,
      "frequences",
      product.frequency,
    );
    const weightEntries = getProductWeightEntries(product);

    return weightEntries.map((entry, index) => {
      const variant = product.variants[index];
      const variantCode = variant
        ? requireOptionCode(options, "variantes", variant.type)
        : undefined;
      const unitCode = requireOptionCode(
        options,
        "unites",
        getUnitCode(product.name, variant?.type),
      );

      return {
        scenario,
        produit: productCode,
        ...(variantCode ? { variante: variantCode } : {}),
        frequence: frequencyCode,
        occurence_par_an: roundedApiNumber(entry.occurrencePerYear),
        quantite_par_occurrence: roundedApiNumber(variant?.count ?? 1),
        unite_fr: unitCode,
        poids_annuel_kg: roundedApiNumber(entry.weightInGrams / 1000),
      };
    });
  });

export const buildPersistedSubmission = (
  input: PersistedSubmissionInput,
  options: SubmissionOptions,
): PersistedSubmission => {
  const email = input.email.trim();
  if (input.mode === "noConsumption") {
    if (input.products.length !== 1 || input.products[0]?.name !== "none") {
      throw new Error(
        "No-consumption submission requires only the none product",
      );
    }

    return persistedSubmissionSchema.parse({
      response: {
        ...(email ? { email } : {}),
        impact_initial: requireOptionCode(
          options,
          "impacts",
          input.impactInitial,
        ),
        consentement_omega3: input.consentOmega3,
      },
      consommations: [],
    });
  }

  const selectedProduct = input.products.find((product) =>
    product.name === "none"
      ? false
      : getProductWeightEntries(product).some(
          (entry) => entry.key === input.selectedProductKey,
        ),
  );

  if (!selectedProduct) {
    throw new Error("Selected product is unavailable");
  }

  const selectedWeightEntries = getProductWeightEntries(selectedProduct);
  const selectedVariants = selectedProduct.variants.filter(
    (_, index) =>
      selectedWeightEntries[index]?.key === input.selectedProductKey,
  );
  const afterCommitmentProduct: UserProductConsumption = {
    ...selectedProduct,
    frequency: FREQUENCY.OtherYearly,
    occurrence: input.replacementFrequencyPerYear,
    variants: selectedProduct.variants.length > 0 ? selectedVariants : [],
  };
  const initialScenario = requireOptionCode(options, "scenarios", "initial");
  const afterCommitmentScenario = requireOptionCode(
    options,
    "scenarios",
    "afterCommitment",
  );
  return persistedSubmissionSchema.parse({
    response: {
      ...(email ? { email } : {}),
      impact_initial: requireOptionCode(
        options,
        "impacts",
        input.impactInitial,
      ),
      impact_apres_engagement: requireOptionCode(
        options,
        "impacts",
        input.impactAfterCommitment,
      ),
      alternative_choisie: requireOptionCode(
        options,
        "alternatives",
        input.alternative,
      ),
      supplement_choisi: requireOptionCode(
        options,
        "supplements",
        input.supplement,
      ),
      consentement_omega3: input.consentOmega3,
    },
    consommations: [
      ...buildConsumptionRows(input.products, initialScenario, options),
      ...buildConsumptionRows(
        [afterCommitmentProduct],
        afterCommitmentScenario,
        options,
      ),
    ],
  });
};

export type PersistedSubmissionResult =
  | { success: true; id: number; replayed: boolean }
  | {
      success: false;
      error: "invalid_input" | "conflict" | "rate_limited" | "unavailable";
    };

type Fetcher = typeof fetch;

interface SubmissionAttempt {
  fingerprint: string;
  idempotencyKey: string;
  retryable: boolean;
  result?: PersistedSubmissionResult;
}

export const createPersistedSubmissionClient = (
  fetcher: Fetcher = (...args) => fetch(...args),
  createUuid: () => string = () => globalThis.crypto.randomUUID(),
) => {
  let optionsPromise: Promise<SubmissionOptions> | null = null;
  let latestAttempt: SubmissionAttempt | null = null;
  let inFlight: {
    fingerprint: string;
    promise: Promise<PersistedSubmissionResult>;
  } | null = null;

  const getOptions = async (): Promise<SubmissionOptions> => {
    if (!optionsPromise) {
      optionsPromise = fetcher("/api/v1/options", { cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) throw new Error("Options unavailable");
          const parsed = submissionOptionsSchema.safeParse(
            await response.json(),
          );
          if (!parsed.success) throw new Error("Invalid options response");
          return parsed.data;
        })
        .catch((error: unknown) => {
          optionsPromise = null;
          throw error;
        });
    }

    return optionsPromise;
  };

  const submit = async (
    input: PersistedSubmissionInput,
  ): Promise<PersistedSubmissionResult> => {
    let options: SubmissionOptions;
    try {
      options = await getOptions();
    } catch (error) {
      console.error(
        "Calculator submission could not load options:",
        error instanceof Error ? error.name : "Unknown error",
      );
      return { success: false, error: "unavailable" };
    }

    let payload: PersistedSubmission;
    try {
      payload = buildPersistedSubmission(input, options);
    } catch (error) {
      console.error(
        "Calculator submission payload validation failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
      return { success: false, error: "invalid_input" };
    }

    const fingerprint = JSON.stringify(payload);
    if (
      latestAttempt?.fingerprint === fingerprint &&
      latestAttempt.result?.success
    ) {
      return latestAttempt.result;
    }
    if (inFlight?.fingerprint === fingerprint) return inFlight.promise;

    const idempotencyKey =
      latestAttempt?.fingerprint === fingerprint && latestAttempt.retryable
        ? latestAttempt.idempotencyKey
        : createUuid();
    latestAttempt = { fingerprint, idempotencyKey, retryable: true };

    const promise = (async (): Promise<PersistedSubmissionResult> => {
      let result: PersistedSubmissionResult;
      let retryable = false;
      let status: number | null = null;

      try {
        const response = await fetcher("/api/v1/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify(payload),
        });
        status = response.status;

        if (status === 200 || status === 201) {
          const parsed = z
            .object({ id: z.number().int().positive() })
            .safeParse(await response.json());
          if (parsed.success) {
            result = {
              success: true,
              id: parsed.data.id,
              replayed: status === 200,
            };
          } else {
            retryable = true;
            result = { success: false, error: "unavailable" };
          }
        } else {
          retryable = status === 503 || status >= 500;
          result = {
            success: false,
            error:
              status === 422
                ? "invalid_input"
                : status === 409
                  ? "conflict"
                  : status === 429
                    ? "rate_limited"
                    : "unavailable",
          };
        }
      } catch {
        retryable = true;
        result = { success: false, error: "unavailable" };
      }

      if (latestAttempt?.idempotencyKey === idempotencyKey) {
        latestAttempt = { fingerprint, idempotencyKey, retryable, result };
      }

      return result;
    })();

    inFlight = { fingerprint, promise };
    const result = await promise;
    if (inFlight?.promise === promise) inFlight = null;
    return result;
  };

  return { getOptions, submit };
};

const persistedSubmissionClient = createPersistedSubmissionClient();

export const getSubmissionOptions = persistedSubmissionClient.getOptions;
export const persistCalculatorSubmission = persistedSubmissionClient.submit;
