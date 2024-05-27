import React from "react";
import "@/lib/env";
import About from "./about";
import { getTranslations } from "next-intl/server";
import { locales } from "@/navigation";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: typeof locales };
}) {
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("title"),
  };
}

const Page = () => {
  return <About />;
};

export default Page;
