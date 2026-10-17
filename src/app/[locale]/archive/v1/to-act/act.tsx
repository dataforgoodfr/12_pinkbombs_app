"use client";

import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import Edito from "@/components/v1/Edito";
import IntroBlock from "@/components/v1/IntroBlock";
import JoinBlock from "@/components/v1/JoinBlock";

const Act = () => {
  const t = useTranslations("act");
  const locale = useLocale();

  return (
    <>
      <IntroBlock title={t("title")} className="bg-yellow1" />

      {/* <Edito
        title={t("company.title")}
        titleLevel="h2"
        content={t("company.content")}
        ctas={[{label: t("company.link"), target:t("company.target"), isBlank: true}]}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          src: "/archive/v1/images/act/call-companies.jpg",
        }}
      /> */}

      <Edito
        title={t("territory.title")}
        titleLevel="h2"
        content={t("territory.content")}
        ctas={[
          {
            label: t("territory.link"),
            target: t("territory.target"),
            isBlank: true,
          },
        ]}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          src: `/archive/v1/images/act/stop-industry-${locale}.jpg`,
        }}
      />

      <Edito
        title={t("eat.title")}
        titleLevel="h2"
        content={t("eat.content")}
        ctas={[
          {
            label: t("eat.link"),
            target: t("eat.target"),
            isBlank: true,
          },
        ]}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          src: `/archive/v1/images/act/citizens-${locale}.jpg`,
        }}
      />

      <Edito
        title={t("seastemik.title")}
        titleLevel="h2"
        content={t.raw("seastemik.content")}
        ctas={[
          {
            label: t("seastemik.ctas.0.label"),
            target: t("seastemik.ctas.0.target"),
            isBlank: true,
          },
          {
            label: t("seastemik.ctas.1.label"),
            target: t("seastemik.ctas.1.target"),
            isBlank: true,
          },
          {
            label: t("seastemik.ctas.2.label"),
            target: t("seastemik.ctas.2.target"),
            isBlank: true,
          },
        ]}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          src: `/archive/v1/images/act/support-seastemik-${locale}.jpg`,
        }}
      />

      <Edito
        title={t("report.title")}
        titleLevel="h2"
        content={t("report.content")}
        ctas={[
          {
            label: t("report.link"),
            target: t("report.target"),
            isBlank: true,
          },
        ]}
        className="bg-pink1"
        contentPosition="right"
        mode="light"
        image={{
          src: `/archive/v1/images/act/seastemik-report-${locale}.png`,
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
