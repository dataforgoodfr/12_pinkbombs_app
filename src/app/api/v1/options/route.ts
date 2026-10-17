/* eslint-disable no-console */

import { submissionOptionsSchema } from "@/lib/calculator/persistedSubmission";
import { getPinkbombsApiUrl } from "@/lib/calculator/pinkbombsApiServer";

export async function GET(): Promise<Response> {
  const url = getPinkbombsApiUrl("api/v1/options");
  if (!url) {
    console.log("Pinkbombs API URL is unavailable");
    return Response.json(
      { error: "Submission service unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) {
      console.log("Pinkbombs API responded with an error:", upstream.status);
      return Response.json(
        { error: "Submission service unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    const upstreamBody: unknown = await upstream.json();
    const normalizedBody =
      typeof upstreamBody === "object" &&
      upstreamBody !== null &&
      "options" in upstreamBody
        ? upstreamBody
        : { options: upstreamBody };
    const parsed = submissionOptionsSchema.safeParse(normalizedBody);
    if (!parsed.success) {
      console.log(
        "Failed to parse submission options from Pinkbombs API:",
        parsed.error.issues.map(({ code, path }) => ({
          code,
          path: path.join("."),
        })),
      );
      return Response.json(
        { error: "Submission service unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    return Response.json(parsed.data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.log(
      "Pinkbombs options request failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    return Response.json(
      { error: "Submission service unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
