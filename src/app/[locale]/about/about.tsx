"use client";

import * as React from "react";
import "@/lib/env";

import IntroBlock from "@/components/IntroBlock";
import TitleBlock from "@/components/TitleBlock";
import AboutSection from "@/components/AboutSection";
import { useTranslations } from "next-intl";

import "@/styles/globals.css";

const About = () => {
  const t = useTranslations("about");

  return (
    <>
      <IntroBlock title={t("title")} />

      <TitleBlock title={t("why.title")} id="whySectionTitle" />
      <AboutSection content={t("why.content")}/>

      <TitleBlock title={t("who.title")} id="whoSectionTitle" />
      <AboutSection content={t("who.content")}/>

      <TitleBlock title={t("methods.title")} id="methodsSectionTitle" />
      <AboutSection content={t("methods.content")} />

      <IntroBlock title={t("sources")} />

      <TitleBlock title={t("macro.title")} id="macroSectionTitle" />
      <AboutSection content={t("macro.content00")}/>
      <AboutSection content={t("macro.table")}/>
      <AboutSection content={t("macro.content01")}/>

      <TitleBlock title={t("alternatives.title")} id="alternativesSectionTitle" />
      <AboutSection content={t("alternatives.content")}/>

      <TitleBlock title={t("companies.title")} id="companiessSectionTitle" />
      <AboutSection content={t("companies.content")}/>
      <AboutSection content={t("companies.farms_map.title")} classname="uppercase font-bold"/>
      <AboutSection content={t("companies.farms_map.data.title")} classname="p-leavy"/>
      <AboutSection content={t("companies.farms_map.data.content")}/>
      <AboutSection content={t("companies.farms_map.carbon.title")} classname="p-leavy"/>
      <AboutSection content={t("companies.farms_map.carbon.content")} />
      <AboutSection content={t("companies.farms_map.limits.title")} classname="p-leavy"/>
      <AboutSection content={t("companies.farms_map.limits.content")} />
      <AboutSection content={t("companies.farms_companies.title")} classname="uppercase font-bold"/>
      <AboutSection content={t("companies.farms_companies.content")}/>
      <AboutSection content={t("companies.farms_figures.title")} classname="uppercase font-bold"/>
      <AboutSection content={t("companies.farms_figures.content")}/>


      <TitleBlock title={t("biodiversity.title")} id="biodiversitySectionTitle"/>
      <AboutSection content={t("biodiversity.deforestation.title")} classname="p-leavy"/>
      <AboutSection content={t("biodiversity.deforestation.content")}/>
      <AboutSection content={t("biodiversity.evasion.title")} classname="p-leavy"/>
      <AboutSection content={t("biodiversity.evasion.content")}/>


      <TitleBlock title={t("human_health.title")} id="humanHealthSectionTitle"/>
      <AboutSection content={t("human_health.antibiotics.title")} classname="p-leavy"/>
      <AboutSection content={t("human_health.antibiotics.content")}/>
      <AboutSection content={t("human_health.microplastics.title")} classname="p-leavy"/>
      <AboutSection content={t("human_health.microplastics.content")}/>


      <TitleBlock title={t("animal_welfare.title")} id="animalWelfareSectionTitle"/>
      <AboutSection content={t("animal_welfare.density.title")} classname="p-leavy"/>
      <AboutSection content={t("animal_welfare.density.content")}/>
      <AboutSection content={t("animal_welfare.mortality.title")} classname="p-leavy"/>
      <AboutSection content={t("animal_welfare.mortality.content")}/>


      <TitleBlock title={t("climate.title")} id="climateSectionTitle"/>
      <AboutSection content={t("climate.content")}/>

      
      <TitleBlock title={t("social.title")} id="socialWelfareSectionTitle"/>
      <AboutSection content={t("social.content")}/>

    </>
  );
};

export default About;