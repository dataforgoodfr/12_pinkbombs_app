import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { localesValues } from "@/navigation";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!localesValues.includes(locale as "fr" | "en")) notFound();

  return {
    messages: {
      ...(await import(`../messages/${locale}/archive/v1/pages/about.json`))
        .default,
      ...(await import(`../messages/${locale}/archive/v1/pages/act.json`))
        .default,
      ...(await import(`../messages/${locale}/archive/v1/pages/legal.json`))
        .default,
      ...(await import(`../messages/${locale}/archive/v1/pages/dashboard.json`))
        .default,
      ...(await import(`../messages/${locale}/archive/v1/pages/story.json`))
        .default,
      ...(await import(`../messages/${locale}/archive/v1/components.json`))
        .default,
      ...(await import(`../messages/${locale}/archive/v1/layout.json`)).default,
    },
  };
});
