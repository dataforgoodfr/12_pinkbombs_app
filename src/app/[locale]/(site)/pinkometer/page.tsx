import { getTranslations } from "next-intl/server";
import React from "react";
import "@/lib/env";

import Calculator from "./calculator-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site.calculator" });

  return {
    title: t("meta.title"),
  };
}

const Page = () => {
  return <Calculator />;
};

export default Page;
