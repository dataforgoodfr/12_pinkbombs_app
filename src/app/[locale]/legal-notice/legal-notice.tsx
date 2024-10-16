"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import IntroBlock from "@/components/IntroBlock";

const LegalNotice = () => {
  const t = useTranslations("legal");

  return (
    <>
      <IntroBlock title={t("title")} baseline={t("sub")} />

      <div
        className="p-6 md:p-12 max-w-[1000px] mx-auto prose"
        dangerouslySetInnerHTML={{ __html: t.raw("content") }}
      />
    </>
  );
};

export default LegalNotice;
