import { getTranslations } from "next-intl/server";
import React from "react";
import "@/lib/env";

import ToBeInspired from "./to-be-inspired";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site.toBeInspired" });

  return {
    title: t("meta.title"),
  };
}

const Page = () => {
  return <ToBeInspired />;
};

export default Page;
