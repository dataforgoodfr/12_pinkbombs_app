"use client";

import * as React from "react";
import "@/lib/env";

import IntroBlock from "@/components/IntroBlock";
import TitleBlock from "@/components/TitleBlock";
import { useTranslations } from "next-intl";

import "@/styles/globals.css"

const About = () => {

  const t = useTranslations("about")

  return (
    <>
      <IntroBlock title={t("title")}/>
      <WhySection />
      <WhoSection />
      <MethodsSection />
    </>
  );
};

export default About;


const WhySection = () => {
  const t = useTranslations("about")
  return (
    <>
      <TitleBlock title={t("why.title")} id="whySectionTitle"/>
      <p className="p-leavy">{t("why.content")}</p>
      <ul className="list-disc">
        <li>{t("why.list.01")}</li>
        <li>{t("why.list.02")}</li>
        <li>{t("why.list.03")}</li>
      </ul>
    </>
  )
}

const WhoSection = () => {
  const t = useTranslations("about")
  return (
    <>
      <TitleBlock title={t("who.title")} id="whoSectionTitle"/>
      <p className="p-leavy">{t("who.content")}</p>
      <ul className="list-disc">
        <li>{t("who.list.01")}</li>
        <li>{t("who.list.02")}</li>
      </ul>
    </>
  )
}

const MethodsSection = () => {
  const t = useTranslations("about")
  return (
    <>
      <TitleBlock title={t("methods.title")} id="methodsSectionTitle"/>
      <p className="p-leavy">{t("methods.content.01")}</p>
      <p className="p-leavy">{t("methods.content.02")}</p>
      <ul className="list-decimal">
        <li>{t("methods.list01.01")}</li>
        <li>{t("methods.list01.02")}</li>
        <li>{t("methods.list01.03")}</li>
      </ul>
      <p className="p-leavy">{t("methods.content.03")}</p>
      <ul className="list-decimal">
        <li>{t("methods.list02.01")}</li>
        <li>{t("methods.list02.02")}</li>
        <li>{t("methods.list02.03")}</li>
      </ul>
    </>
  )
}
