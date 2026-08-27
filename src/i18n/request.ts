import { headers } from "next/headers"; // 👈 Native Next.js headers API
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { localesValues } from "@/navigation";

export default getRequestConfig(async () => {
  // 1. Await the native Next.js headers object (required in Next 15+)
  const headersList = await headers();
  // 2. Extract the locale injected by your proxy.ts (middleware)
  const locale = headersList.get("x-next-intl-locale");

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !localesValues.includes(locale as "fr" | "en")) notFound();

  return {
    locale,
    messages: {
      ...(await import(`../../messages/${locale}/archive/v1/pages/about.json`))
        .default,
      ...(await import(`../../messages/${locale}/archive/v1/pages/act.json`))
        .default,
      ...(await import(`../../messages/${locale}/archive/v1/pages/legal.json`))
        .default,
      ...(
        await import(`../../messages/${locale}/archive/v1/pages/dashboard.json`)
      ).default,
      ...(await import(`../../messages/${locale}/archive/v1/pages/story.json`))
        .default,
      ...(await import(`../../messages/${locale}/archive/v1/components.json`))
        .default,
      ...(await import(`../../messages/${locale}/archive/v1/layout.json`))
        .default,
      site: {
        ...(await import(`../../messages/${locale}/(site)/layout.json`))
          .default,
        ...(await import(`../../messages/${locale}/(site)/components.json`))
          .default,
        ...(await import(`../../messages/${locale}/(site)/pages/homepage.json`))
          .default,
      },
    },
  };
});
