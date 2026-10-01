export interface NewsletterSubscriptionResult {
  success: boolean;
  error?: "invalid_email" | "configuration" | "brevo" | "method" | "network";
}

export type NewsletterSubscriptionService = (
  email: string,
) => Promise<NewsletterSubscriptionResult>;

export const subscribeToNewsletter: NewsletterSubscriptionService = async (
  email,
) => {
  try {
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      try {
        return (await response.json()) as NewsletterSubscriptionResult;
      } catch {
        return { success: false, error: "brevo" };
      }
    }

    return { success: true };
  } catch {
    return { success: false, error: "network" };
  }
};
