import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["fr", "en"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: {
      ...(await import(`../messages/${locale}/pages/about.json`)).default,
      ...(await import(`../messages/${locale}/pages/act.json`)).default,
      ...(await import(`../messages/${locale}/pages/dashboard.json`)).default,
      ...(await import(`../messages/${locale}/pages/story.json`)).default,
      ...(await import(`../messages/${locale}/components.json`)).default,
      ...(await import(`../messages/${locale}/layout.json`)).default,
    },
  };
});
