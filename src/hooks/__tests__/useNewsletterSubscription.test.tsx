import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import type { NewsletterSubscriptionService } from "@/lib/newsletter/submission";

import { useNewsletterSubscription } from "../useNewsletterSubscription";

describe("useNewsletterSubscription", () => {
  it("tracks a successful subscription", async () => {
    const service = jest
      .fn<NewsletterSubscriptionService>()
      .mockResolvedValue({ success: true });
    const { result } = renderHook(() => useNewsletterSubscription({ service }));

    let subscription: Promise<unknown>;
    act(() => {
      subscription = result.current.subscribe("person@example.com");
    });

    expect(result.current.isSubmitting).toBe(true);
    await act(async () => subscription);

    expect(service).toHaveBeenCalledWith("person@example.com");
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.result).toEqual({ success: true });
  });

  it("stores subscription errors", async () => {
    const service = jest
      .fn<NewsletterSubscriptionService>()
      .mockResolvedValue({ success: false, error: "brevo" });
    const { result } = renderHook(() => useNewsletterSubscription({ service }));

    await act(async () => {
      await result.current.subscribe("person@example.com");
    });

    expect(result.current.result).toEqual({ success: false, error: "brevo" });
    expect(result.current.isSubmitting).toBe(false);
  });
});
