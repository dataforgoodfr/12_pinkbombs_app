import { z } from "zod";

import { persistedSubmissionSchema } from "@/lib/calculator/persistedSubmission";
import {
  getPinkbombsApiUrl,
  getSafeUpstreamError,
} from "@/lib/calculator/pinkbombsApiServer";

const idempotencyKeySchema = z.string().uuid();
const createdSubmissionSchema = z
  .object({ id: z.number().int().positive() })
  .strict();

export async function POST(request: Request): Promise<Response> {
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (
    !idempotencyKey ||
    !idempotencyKeySchema.safeParse(idempotencyKey).success
  ) {
    return Response.json({ error: "Invalid submission" }, { status: 422 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid submission" }, { status: 422 });
  }

  const parsed = persistedSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid submission" }, { status: 422 });
  }

  const url = getPinkbombsApiUrl("api/v1/submissions");
  if (!url) {
    return Response.json(
      { error: "Submission service unavailable" },
      { status: 503 },
    );
  }

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    if (upstream.status === 200 || upstream.status === 201) {
      const created = createdSubmissionSchema.safeParse(await upstream.json());
      if (!created.success) {
        return Response.json(
          { error: "Submission service unavailable" },
          { status: 503 },
        );
      }

      return Response.json(created.data, { status: upstream.status });
    }

    const status = [409, 422, 429, 503].includes(upstream.status)
      ? upstream.status
      : 503;
    return Response.json({ error: getSafeUpstreamError(status) }, { status });
  } catch {
    return Response.json(
      { error: "Submission service unavailable" },
      { status: 503 },
    );
  }
}
