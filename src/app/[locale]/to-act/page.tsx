import React from "react";
import "@/lib/env";
import Act from "./act";
import { getTranslations } from "next-intl/server";
import { locales } from "@/navigation";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: typeof locales };
}) {
  const t = await getTranslations({ locale, namespace: "act" });

  return {
    title: t("title"),
  };
}

const Page = () => {
  return <Act />;
};

export default Page;
