import { getTranslations } from "next-intl/server";
import React from "react";
import "@/lib/env";

import ToUnderstand from "./to-understand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site.toUnderstand" });

  return {
    title: t("meta.title"),
  };
}

const Page = () => {
  return <ToUnderstand />;
};

export default Page;
