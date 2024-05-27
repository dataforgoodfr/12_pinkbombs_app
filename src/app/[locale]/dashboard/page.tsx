import React from "react";
import "@/lib/env";
import Dashboard from "./dashboard";
import { getTranslations } from "next-intl/server";
import { locales } from "@/navigation";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: typeof locales };
}) {
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return {
    title: t("title"),
  };
}

const Page = () => {
  return <Dashboard />;
};

export default Page;
