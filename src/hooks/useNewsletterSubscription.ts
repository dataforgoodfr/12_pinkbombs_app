import * as React from "react";

import {
  type NewsletterSubscriptionService,
  subscribeToNewsletter,
} from "@/lib/newsletter/submission";

interface UseNewsletterSubscriptionOptions {
  service?: NewsletterSubscriptionService;
}

export const useNewsletterSubscription = ({
  service = subscribeToNewsletter,
}: UseNewsletterSubscriptionOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<Awaited<
    ReturnType<NewsletterSubscriptionService>
  > | null>(null);

  const subscribe = async (email: string) => {
    setIsSubmitting(true);
    setResult(null);

    const nextResult = await service(email);
    setResult(nextResult);
    setIsSubmitting(false);

    return nextResult;
  };

  return {
    isSubmitting,
    result,
    subscribe,
  };
};
