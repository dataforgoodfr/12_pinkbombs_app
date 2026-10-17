import { getTranslations } from "next-intl/server";
import React from "react";
import "@/lib/env";

import Dashboard from "./dashboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return {
    title: t("meta.title"),
  };
}

const Page = () => {
  return <Dashboard />;
};

export default Page;
