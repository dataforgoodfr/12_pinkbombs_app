"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import Edito from "@/components/Edito";
import IntroBlock from "@/components/IntroBlock";

const Act = () => {
  const t = useTranslations("act");

  return (
    <>
      <IntroBlock title={t("title")} className="bg-yellow1" />

      <Edito
        title={t("company.title")}
        content={t("company.content")}
        linkLabel={t("company.link")}
        link="#"
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          large: "/images/storytelling/biodiversity-hd.webp",
        }}
      />
    </>
  );
};

export default Act;
