import Image from "next/image";
import { getTranslations } from "next-intl/server";
import * as React from "react";

import "@/styles/globals.css";

import Footer from "@/components/v1/layout/Footer";
import Navbar from "@/components/v1/layout/Navbar";

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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2.layout" });
  return (
    <>
      <Navbar />
      <main>
        {children}
        <a
          href="#"
          className="hidden md:flex items-center justify-center bg-white hover:bg-darkblue1 w-14 h-14 rounded-tl-md fixed bottom-0 right-0 transition-all ease-in duration-75"
        >
          <Image
            src="/archive/v1/images/bottom.svg"
            alt={t("top")}
            width="40"
            height="20"
            className="w-8 aspect-square rotate-180"
          />
        </a>
      </main>
      <Footer />
    </>
  );
}
