import { getTranslations } from "next-intl/server";
import React from "react";
import "@/lib/env";

import { locales } from "@/navigation";

import About from "./about";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: typeof locales };
}) {
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("meta.title"),
  };
}

const Page = () => {
  return <About />;
};

export default Page;
