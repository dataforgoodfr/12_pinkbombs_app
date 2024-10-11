import { getTranslations } from "next-intl/server";
import React from "react";
import "@/lib/env";

import { locales } from "@/navigation";

import LegalNotice from "./legal-notice";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: typeof locales };
}) {
  const t = await getTranslations({ locale, namespace: "legal" });

  return {
    title: t("meta.title"),
  };
}

const Page = () => {
  return <LegalNotice />;
};

export default Page;
