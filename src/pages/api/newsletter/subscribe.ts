import type { NextApiRequest, NextApiResponse } from "next";

import logger from "@/lib/logger";

interface NewsletterResponse {
  success: boolean;
  error?:
    | "invalid_email"
    | "configuration"
    | "already_subscribed"
    | "brevo"
    | "method";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<NewsletterResponse>,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ success: false, error: "method" });
  }

  const email =
    typeof request.body?.email === "string"
      ? request.body.email.trim().toLowerCase()
      : "";

  if (!emailPattern.test(email)) {
    return response.status(400).json({
      success: false,
      error: "invalid_email",
    });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID);

  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    logger("Brevo newsletter is not configured");
    return response.status(500).json({
      success: false,
      error: "configuration",
    });
  }

  try {
    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!brevoResponse.ok) {
      let brevoError: { code?: string } = {};

      try {
        brevoError = (await brevoResponse.json()) as { code?: string };
      } catch {
        // Brevo may return an empty body for some errors.
      }

      if (brevoError.code === "duplicate_parameter") {
        return response.status(200).json({
          success: true,
          error: "already_subscribed",
        });
      }

      logger(
        {
          status: brevoResponse.status,
        },
        "Brevo newsletter request failed",
      );
      return response.status(502).json({
        success: false,
        error: "brevo",
      });
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    logger(error, "Brevo newsletter request failed");
    return response.status(502).json({
      success: false,
      error: "brevo",
    });
  }
}
