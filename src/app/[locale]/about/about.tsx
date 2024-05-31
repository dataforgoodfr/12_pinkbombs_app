"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import AboutSection from "@/components/AboutSection";
import TitleBlock from "@/components/TitleBlock";

const About = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock title={t("title")} />

      <WhySection />
      <WhoSection />
      <MethodsSection />

      <TitleBlock title={t("sources")} />

      <MacroSection />
      <AlternativesSection />
      <CompaniesSection />
      <BiodiversitySection />
      <HumanSection />
      <AnimalSection />
      <ClimateSection />
      <SocialSection />
    </>
  );
};

export default About;

const WhySection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("why.content")}
        title={t("why.title")}
        id="why-section-title"
      />
    </>
  );
};

const WhoSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("who.content")}
        title={t("who.title")}
        id="who-section-title"
      />
    </>
  );
};

const MethodsSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("methods.content")}
        title={t("methods.title")}
        id="methods-section-title"
      />
    </>
  );
};

const MacroSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("macro.content")}
        title={t("macro.title")}
        id="macro-section-title"
      />
    </>
  );
};

const AlternativesSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("alternatives.content")}
        title={t("alternatives.title")}
        id="alternatives-section-title"
      />
      <Link
        className="inline-flex justify-center mx-6 md:mx-12 xl:mx-[60px] mb-10 p-4 min-w-40 lg:text-2xl text-red1 bg-tranparent font-secondary uppercase rounded-xl tracking-widest border-2 font-bold border-red1 hover:bg-red1 hover:text-white transition-all ease-in-out duration-100"
        href={t("alternatives.link")}
      >
        {t("alternatives.button")}
      </Link>
    </>
  );
};

const CompaniesSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("companies.content")}
        title={t("companies.title")}
        id="companies-section-title"
      />
    </>
  );
};

const BiodiversitySection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("biodiversity.content")}
        title={t("biodiversity.title")}
        id="biodiversity-section-title"
      />
    </>
  );
};

const HumanSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("human_health.content")}
        title={t("human_health.title")}
        id="human-health-section-title"
      />
    </>
  );
};

const AnimalSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("animal_welfare.content")}
        title={t("animal_welfare.title")}
        id="animal-welfare-section-title"
      />
    </>
  );
};

const ClimateSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        content={t("climate.content")}
        title={t("climate.title")}
        id="climate-section-title"
      />
    </>
  );
};

const SocialSection = () => {
  const t = useTranslations("about");
  return (
    <>
      <AboutSection
        content={t("social.content")}
        title={t("social.title")}
        id="social-section-title"
      />
    </>
  );
};
