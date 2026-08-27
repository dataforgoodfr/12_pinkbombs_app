import clsx from "clsx";
import { Barlow_Condensed, Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import * as React from "react";

const barlow = Barlow_Condensed({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});

const montserrat = Montserrat({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

import "@/styles/archive/v1/styles.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "siteConfig" });

  return {
    metadataBase: new URL(t("url")),
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    robots: { index: true, follow: true },
    icons: {
      icon: "/favicon/favicon.ico",
      shortcut: "/favicon/favicon.ico",
      apple: "/favicon/apple-touch-icon.png",
    },
    manifest: `/favicon/site.webmanifest`,
    openGraph: {
      url: t("url"),
      title: t("title"),
      description: t("description"),
      siteName: t("title"),
      images: [`${t("url")}/images/og.jpg`],
      type: "website",
      locale: "fr",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${t("url")}/images/og.jpg`],
    },
  };
}

export default async function GlobalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  return (
    <html
      lang={locale}
      className={clsx(
        barlow.variable,
        montserrat.variable,
        "scroll-smooth overflow-x-hidden",
      )}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
