import { getTranslations } from "next-intl/server";
import * as React from "react";

import "@/styles/site/styles.css";

import Footer from "@/components/v2/layout/Footer";
import { MatomoConsentProvider } from "@/components/v2/layout/MatomoConsent";
import Navbar from "@/components/v2/layout/Navbar";
import SectionBackground from "@/components/v2/layout/SectionBackground";

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

export default async function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProductionDeployment = process.env.VERCEL_ENV === "production";

  return (
    <MatomoConsentProvider isProduction={isProductionDeployment}>
      <SectionBackground />
      <Navbar />
      <main className="overflow-x-clip pt-[calc(88px_+_env(safe-area-inset-top))] md:pt-0">
        {children}
      </main>
      <Footer />
    </MatomoConsentProvider>
  );
}
