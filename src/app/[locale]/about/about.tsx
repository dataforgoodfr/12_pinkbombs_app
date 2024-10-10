"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import AboutSection from "@/components/AboutSection";
import IntroBlock from "@/components/IntroBlock";
import TitleBlock from "@/components/TitleBlock";

const About = () => {
  const t = useTranslations("about");

  return (
    <>
      <IntroBlock title={t("title")} />
      <ExplainSection />

      <TitleBlock title={t("sources")} />
      <MacroSection />
      <CompaniesSection />
      <BiodiversitySection />
      <HumanSection />
      <AnimalSection />
      <ClimateSection />
      <SocialSection />
      <AlternativesSection />
    </>
  );
};

export default About;

const ExplainSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <TitleBlock
        spaceY="mb-4 lg:mb-8"
        id="who-section-title"
        title={t("who.title")}
      />
      {/*<AboutSection content={t.raw("who.content")} />*/}
      <div className="px-6 md:px-12 max-w-[1000px] mx-auto">
        <p dangerouslySetInnerHTML={{ __html: t.raw("who.content.first") }} />
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="h3 text-red1 mt-8 mb-4">
              {t("who.content.parts.seastemik.title")}
            </h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("who.content.parts.seastemik.content"),
              }}
              className="my-4"
            />
            <a
              href="https://seastemik.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-red1 underline hover:no-underline"
            >
              {t("who.content.parts.seastemik.link")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                className="inline-block ml-2 align-baseline fill-red1 group-hover:fill-darkblue1"
                viewBox="0 -960 960 960"
                width="16"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
              </svg>
            </a>
          </div>
          <div>
            <h3 className="h3 text-red1 mt-8 mb-4">
              {t("who.content.parts.dataforgood.title")}
            </h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("who.content.parts.dataforgood.content"),
              }}
              className="my-4"
            />
            <a
              href="https://seastemik.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-red1 underline hover:no-underline"
            >
              {t("who.content.parts.dataforgood.link")}
              <svg
                xmlns="https://dataforgood.fr/"
                height="16"
                className="inline-block ml-2 align-baseline fill-red1 group-hover:fill-darkblue1"
                viewBox="0 -960 960 960"
                width="16"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
              </svg>
            </a>
          </div>
        </div>
        <p
          className="mt-16 lg:mt-20"
          dangerouslySetInnerHTML={{ __html: t.raw("who.content.last") }}
        />
      </div>

      <TitleBlock
        spaceY="mt-12 lg:mt-24 mb-4 lg:mb-8"
        id="why-section-title"
        title={t("why.title")}
      />
      <AboutSection content={t.raw("why.content")} />

      <TitleBlock
        spaceY="mt-12 lg:mt-24 mb-4 lg:mb-8"
        id="methods-section-title"
        title={t("methods.title")}
      />
      <AboutSection
        content={t.raw("methods.content")}
        linkLabel={t("methods.link")}
        link={t("methods.target")}
      />
    </>
  );
};

const MacroSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        title={t("statement.title")}
        content={t.raw("statement.content")}
        id="statement-section"
      />
      <AboutSection title={t("macro.title")} id="macro-section" />
      <AboutSection
        subtitle={t("macro.calculator.title")}
        content={t.raw("macro.calculator.content")}
        id="macro-calculator-section"
      />
      <AboutSection
        subtitle={t("macro.salmon-collapse.title")}
        content={t.raw("macro.salmon-collapse.content")}
        id="macro-salmon-collapse-section"
      />
      <AboutSection
        subtitle={t("macro.hyper-growth.title")}
        content={t.raw("macro.hyper-growth.content")}
        id="macro-hyper-growth-section"
      />

      <AboutSection
        subtitle={t("macro.consumption.title")}
        content={t.raw("macro.consumption.content")}
        id="macro-consumption-section"
      />
    </>
  );
};

const CompaniesSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection id="companies-section" title={t("companies.title")} />
      <AboutSection
        id="companies-top-comp-section"
        subtitle={t("companies.top-comp.title")}
        content={t.raw("companies.top-comp.content")}
      />
      <AboutSection
        id="companies-top-land-section"
        subtitle={t("companies.top-land.title")}
        content={t.raw("companies.top-land.content")}
      />
      <AboutSection
        id="companies-future-land-based-section"
        subtitle={t("companies.future-land-based.title")}
        content={t.raw("companies.future-land-based.content")}
      />
      <AboutSection
        id="companies-future-land-based-map-section"
        subtitle={t("companies.future-land-based-map.title")}
        content={t.raw("companies.future-land-based-map.content")}
      />
      <AboutSection
        id="companies-future-land-keys-section"
        subtitle={t("companies.future-land-keys.title")}
        content={t.raw("companies.future-land-keys.content")}
      />
    </>
  );
};

const BiodiversitySection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection id="biodiversity-section" title={t("biodiversity.title")} />
      <AboutSection
        id="biodiversity-deforestation-section"
        subtitle={t("biodiversity.deforestation.title")}
        content={t.raw("biodiversity.deforestation.content")}
      />
      <AboutSection
        id="biodiversity-escapes-section"
        subtitle={t("biodiversity.escapes.title")}
        content={t.raw("biodiversity.escapes.content")}
      />
    </>
  );
};

const HumanSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection id="human-health-section" title={t("human-health.title")} />
      <AboutSection
        id="human-health-antibiotic-section"
        subtitle={t("human-health.antibiotic.title")}
        content={t.raw("human-health.antibiotic.content")}
      />
      <AboutSection
        id="human-health-microplastics-section"
        subtitle={t("human-health.microplastics.title")}
        content={t.raw("human-health.microplastics.content")}
      />
    </>
  );
};

const AnimalSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection
        id="animal-welfare-section"
        title={t("animal-welfare.title")}
      />

      <AboutSection
        id="animal-welfare-density-section"
        subtitle={t("animal-welfare.density.title")}
        content={t.raw("animal-welfare.density.content")}
      />
      <AboutSection
        id="animal-welfare-mortality-section"
        subtitle={t("animal-welfare.mortality.title")}
        content={t.raw("animal-welfare.mortality.content")}
      />
    </>
  );
};

const ClimateSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection id="climat-section" title={t("climate.title")} />
      <AboutSection
        id="climat-emissions-section"
        subtitle={t("climate.emissions.title")}
        content={t.raw("climate.emissions.content")}
      />
    </>
  );
};

const SocialSection = () => {
  const t = useTranslations("about");

  return (
    <>
      <AboutSection id="social-section" title={t("social.title")} />
      <AboutSection
        id="social-resources-section"
        subtitle={t("social.resources.title")}
        content={t.raw("social.resources.content")}
      />
    </>
  );
};

const AlternativesSection = () => {
  const t = useTranslations("about");

  return (
    <AboutSection
      id="alternatives-section"
      title={t("alternatives.title")}
      content={t.raw("alternatives.content")}
    />
  );
};
