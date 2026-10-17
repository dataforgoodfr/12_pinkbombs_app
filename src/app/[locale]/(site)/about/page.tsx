import { getTranslations } from "next-intl/server";
import React from "react";
import "@/lib/env";

import About from "./about";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site.about" });

  return {
    title: t("meta.title"),
  };
}

const Page = () => {
  return <About />;
};

export default Page;
