"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterForm = () => {
  const t = useTranslations("site.layout");
  const [email, setEmail] = React.useState("");
  const { isSubmitting, subscribe } = useNewsletterSubscription();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      toast.error(t("footer.sections.stayInformed.newsletter.invalidEmail"));
      return;
    }

    const result = await subscribe(normalizedEmail);

    if (result.success) {
      toast.success(t("footer.sections.stayInformed.newsletter.success"));
      setEmail("");
      return;
    }

    toast.error(t("footer.sections.stayInformed.newsletter.error"));
  };

  return (
    <form
      className="flex flex-col lg:flex-row gap-4 lg:gap-2 w-full max-w-xs"
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="sr-only" htmlFor="newsletter-email">
        {t("footer.sections.stayInformed.newsletter.emailLabel")}
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={t("footer.sections.stayInformed.newsletter.placeholder")}
        className="inline-block w-full rounded-xl bg-white px-4 py-2 text-xs text-v2-blue placeholder:text-gray-400 placeholder:text-xs"
        disabled={isSubmitting}
        required
      />
      <button
        type="submit"
        className="inline-flex cta border-2 rounded-xl border-white bg-white px-4 py-2 text-sm text-v2-blue transition-all duration-200 ease-in-out hover:bg-v2-blue hover:text-v2-pink disabled:cursor-not-allowed disabled:opacity-50 lg:text-base"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? t("footer.sections.stayInformed.newsletter.loading")
          : t("footer.sections.stayInformed.newsletter.button")}
      </button>
    </form>
  );
};

export default NewsletterForm;
