"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import Edito from "@/components/Edito";
import IntroBlock from "@/components/IntroBlock";
import JoinBlock from "@/components/JoinBlock";

const Act = () => {
  const t = useTranslations("act");

  return (
    <>
      <IntroBlock title={t("title")} className="bg-yellow1" />

      {/* <Edito
        title={t("company.title")}
        titleLevel="h2"
        content={t("company.content")}
        linkLabel={t("company.link")}
        link={t("company.target")}
        linkBlank
        linkIcon={false}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          large: "/images/act/call-companies.jpg",
        }}
      /> */}

      <Edito
        title={t("territory.title")}
        titleLevel="h2"
        content={t("territory.content")}
        linkLabel={t("territory.link")}
        link={t("territory.target")}
        linkBlank
        linkIcon={false}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          large: "/images/act/stop-industry.jpg",
        }}
      />

      <Edito
        title={t("seastemik.title")}
        titleLevel="h2"
        content={t("seastemik.content")}
        linkLabel={t("seastemik.link")}
        link={t("seastemik.target")}
        linkBlank
        linkIcon={false}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          large: "/images/act/support-seastemik.jpg",
        }}
      />

      <Edito
        title={t("eat.title")}
        titleLevel="h2"
        content={t("eat.content")}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          large: "/images/act/no-eat-salmon.jpg",
        }}
      />

      <JoinBlock
        isAlternative
        className="pt-6 lg:pt-24 bg-brown1 lg:bg-darkblue1"
      />
    </>
  );
};

export default Act;
