import { getTranslations } from "next-intl/server";
import React from "react";
import "@/lib/env";

import LegalNotice from "./legal-notice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  return {
    title: t("meta.title"),
  };
}

const Page = () => {
  return <LegalNotice />;
};

export default Page;
