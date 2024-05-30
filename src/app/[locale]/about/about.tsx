"use client";

import * as React from "react";
import "@/lib/env";

import IntroBlock from "@/components/IntroBlock";
import TitleBlock from "@/components/TitleBlock";
import AboutSection from "@/components/AboutSection";
import Link from "next/link";
import { useTranslations } from "next-intl";

import "@/styles/globals.css";

const About = () => {
  const t = useTranslations("about");

  return (
    <>
      <IntroBlock title={t("title")} className="flex p-6 lg:p-12 text-red1 bg-pink1 min-h-[40px] lg:min-h-[300px]"/>

      <WhySection />
      <WhoSection />
      <MethodsSection />

      <IntroBlock title={t("sources")} className="flex p-6 lg:p-12 text-red1 bg-pink1 min-h-[40px] lg:min-h-[300px]"/>

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
      <TitleBlock title={t("why.title")} id="whySectionTitle" />
      <AboutSection content={t("why.content")} />
    </>
  );
};

const WhoSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock title={t("who.title")} id="whoSectionTitle" />
      <AboutSection content={t("who.content")} />
    </>
  );
};

const MethodsSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock title={t("methods.title")} id="methodsSectionTitle" />
      <AboutSection content={t("methods.content")} />
    </>
  );
};

const MacroSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock title={t("macro.title")} id="macroSectionTitle" />
      <AboutSection content={t("macro.content")} />
    </>
  );
};

const AlternativesSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock
        title={t("alternatives.title")}
        id="alternativesSectionTitle"
      />
      <AboutSection content={t("alternatives.content")} />
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
      <TitleBlock title={t("companies.title")} id="companiessSectionTitle" />
      <AboutSection content={t("companies.content")} />
      <AboutSection
        content={t("companies.mowi.title")}
        classname="uppercase font-bold"
      />
      <AboutSection content={t("companies.mowi.content")} />
      <AboutSection
        content={t("companies.reports.title")}
        classname="uppercase font-bold"
      />
      <AboutSection content={t("companies.reports.content")} />

      <AboutSection
        content={t("companies.farms_map.title")}
        classname="uppercase font-bold"
      />
      <AboutSection
        content={t("companies.farms_map.data.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("companies.farms_map.data.content")} />
      <AboutSection
        content={t("companies.farms_map.carbon.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("companies.farms_map.carbon.content")} />
      <AboutSection
        content={t("companies.farms_map.limits.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("companies.farms_map.limits.content")} />
      <AboutSection
        content={t("companies.farms_companies.title")}
        classname="uppercase font-bold"
      />
      <AboutSection content={t("companies.farms_companies.content")} />
      <AboutSection
        content={t("companies.farms_figures.title")}
        classname="uppercase font-bold"
      />
      <AboutSection content={t("companies.farms_figures.content")} />
    </>
  );
};

const BiodiversitySection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock
        title={t("biodiversity.title")}
        id="biodiversitySectionTitle"
      />
      <AboutSection
        content={t("biodiversity.deforestation.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("biodiversity.deforestation.content")} />
      <AboutSection
        content={t("biodiversity.evasion.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("biodiversity.evasion.content")} />
    </>
  );
};

const HumanSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock
        title={t("human_health.title")}
        id="humanHealthSectionTitle"
      />
      <AboutSection
        content={t("human_health.antibiotics.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("human_health.antibiotics.content")} />
      <AboutSection
        content={t("human_health.microplastics.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("human_health.microplastics.content")} />
    </>
  );
};

const AnimalSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock
        title={t("animal_welfare.title")}
        id="animalWelfareSectionTitle"
      />
      <AboutSection
        content={t("animal_welfare.density.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("animal_welfare.density.content")} />
      <AboutSection
        content={t("animal_welfare.mortality.title")}
        classname="p-leavy"
      />
      <AboutSection content={t("animal_welfare.mortality.content")} />
    </>
  );
};

const ClimateSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock title={t("climate.title")} id="climateSectionTitle" />
      <AboutSection content={t("climate.content")} />
    </>
  );
};

const SocialSection = () => {
  const t = useTranslations("about");
  return (
    <>
      <TitleBlock title={t("social.title")} id="socialWelfareSectionTitle" />
      <AboutSection content={t("social.content")} />
    </>
  );
};
