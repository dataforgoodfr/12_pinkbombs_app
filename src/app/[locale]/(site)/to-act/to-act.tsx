"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useState } from "react";
import "@/lib/env";

import CalculatorBlock from "@/components/v2/CalculatorBlock";
import AccordionCard, {
  RecommendationProps,
} from "@/components/v2/cards/AccordionCard";
import ExplorationBlock from "@/components/v2/ExplorationBlock";

const ToAct = () => {
  return (
    <>
      <IntroSection />
      <RecommendationsSection />
      <CalculatorBlock />
      <ExplorationBlock page="toAct" />
    </>
  );
};

export default ToAct;

const IntroSection = () => {
  const t = useTranslations("site.toAct");

  return (
    <section className="bg-v2-green text-v2-blue">
      <div className="flex flex-col lg:flex-row px-12 pt-12 lg:pt-40 lg:pl-24 gap-12 lg:gap-0 justify-center mx-auto">
        <div className="flex flex-col gap-4 lg:w-[40%]">
          <h4 className="h4 text-pretty">{t("intro.caption")}</h4>
          <h1 className="h1 text-pretty">{t("intro.title")}</h1>
        </div>
        <div className="flex flex-col lg:mt-16 xl:-mt-10 lg:w-[60%]">
          <Image
            loading="lazy"
            src="/site/images/to-act/intro.svg"
            width={841}
            height={461}
            alt={t("intro.imageAlt")}
            className="relative z-0 object-contain"
          />
        </div>
      </div>
      <div className="z-2 relative -mt-8 md:-mt-20 lg:-mt-20 xl:-mt-28 2xl:-mt-32">
        <Image
          loading="lazy"
          src="/site/images/to-act/intro-divider.svg"
          width={1512}
          height={103}
          alt={t("intro.imageAlt")}
          className="object-cover4 md:w-[1024px] lg:w-[1440px] xl:w-[2000px]"
        />
      </div>
    </section>
  );
};

const RecommendationsSection = () => {
  const t = useTranslations("site.toAct");
  const [activeIndividualIndex, setActiveIndividualIndex] = useState<
    number | null
  >(0);
  const [activeCompanyIndex, setActiveCompanyIndex] = useState<number | null>(
    null,
  );
  const [activeSection, setActiveSection] = useState<"individual" | "company">(
    "individual",
  );
  const individualSectionRef = React.useRef<HTMLDivElement>(null);
  const companySectionRef = React.useRef<HTMLDivElement>(null);
  const pendingScrollSectionRef = React.useRef<"individual" | "company" | null>(
    null,
  );
  const handleIndividualToggle = (index: number) => {
    setActiveCompanyIndex(null);
    setActiveIndividualIndex((prev) => (prev === index ? null : index));
  };
  const handleCompanyToggle = (index: number) => {
    setActiveIndividualIndex(null);
    setActiveCompanyIndex((prev) => (prev === index ? null : index));
  };
  const individualRecommendations = t.raw(
    "individualSection.recommendations",
  ) as RecommendationProps[];
  const companyRecommendations = t.raw(
    "companySection.recommendations",
  ) as RecommendationProps[];

  const handleSectionToggle = (section: "individual" | "company") => {
    pendingScrollSectionRef.current = section;
    setActiveSection(section);
    setActiveIndividualIndex(null);
    setActiveCompanyIndex(null);
  };

  // scroll only after the accordion-collapse re-render has committed, so the target position is measured post-layout-shift
  React.useEffect(() => {
    const section = pendingScrollSectionRef.current;
    if (!section) return;
    pendingScrollSectionRef.current = null;
    const sectionElement =
      section === "individual"
        ? individualSectionRef.current
        : companySectionRef.current;
    requestAnimationFrame(() => {
      sectionElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [activeSection, activeIndividualIndex, activeCompanyIndex]);

  // if user scrolls down, we want to set the active section based on the scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const individualSection = document.getElementById("individual-section");
      const companySection = document.getElementById("company-section");
      if (individualSection && companySection) {
        const individualSectionTop =
          individualSection.getBoundingClientRect().top;
        const companySectionTop = companySection.getBoundingClientRect().top;
        if (
          individualSectionTop < window.innerHeight / 2 &&
          companySectionTop > window.innerHeight / 2
        ) {
          setActiveSection("individual");
        } else if (companySectionTop < window.innerHeight / 2) {
          setActiveSection("company");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative z-10 bg-white text-v2-blue">
      <div
        id="individual-section"
        ref={individualSectionRef}
        className="px-6 lg:px-10 pb-16 xl:max-w-[1279px] mx-auto"
      >
        <div className="py-16">
          <SectionButtons
            activeSection={activeSection}
            setActiveSection={handleSectionToggle}
          />
          <div className="flex flex-col gap-4 p-4 max-w-[892px] mx-auto">
            <h2 className="h2 text-center">
              <span className="text-v2-magenta">
                {t("individualSection.title.part1")}
              </span>{" "}
              <span className="text-v2-blue">
                {t("individualSection.title.part2")}
              </span>
            </h2>
          </div>
        </div>
        <div className="flex flex-col">
          {individualRecommendations.map((recommendation, index) => (
            <AccordionCard
              key={index}
              recommendation={recommendation}
              onClick={() => handleIndividualToggle(index)}
              isActive={activeIndividualIndex === index}
              index={index}
              type="individual"
            />
          ))}
        </div>
      </div>
      <Image
        loading="lazy"
        src="/site/images/to-act/divider.svg"
        width={1512}
        height={63}
        alt=""
        className="object-cover xl:w-[2000px]"
      />
      <div
        id="company-section"
        ref={companySectionRef}
        className="px-6 lg:px-10 mb-10 xl:max-w-[1279px] mx-auto"
      >
        <div className="py-16">
          <SectionButtons
            activeSection={activeSection}
            setActiveSection={handleSectionToggle}
          />
          <div className="flex flex-col gap-4 p-4 max-w-[892px] mx-auto">
            <h2 className="h2 text-center">
              <span className="text-v2-blue">
                {t("companySection.title.part1")}
              </span>{" "}
              <span className="text-v2-magenta">
                {t("companySection.title.part2")}
              </span>{" "}
              <span className="text-v2-blue">
                {t("companySection.title.part3")}
              </span>
            </h2>
          </div>
        </div>
        <div className="flex flex-col">
          {companyRecommendations.map((recommendation, index) => (
            <AccordionCard
              key={index}
              recommendation={recommendation}
              onClick={() => handleCompanyToggle(index)}
              isActive={activeCompanyIndex === index}
              index={index}
              type="company"
            />
          ))}
        </div>
      </div>
      <Image
        loading="lazy"
        src="/site/images/about/calculator-block-divider.svg"
        width={1512}
        height={53}
        alt="Divider"
        className="object-cover xl:w-[2000px]"
      />
    </section>
  );
};

const SectionButtons = ({
  activeSection,
  setActiveSection,
}: {
  activeSection: "individual" | "company";
  setActiveSection: (section: "individual" | "company") => void;
}) => {
  const t = useTranslations("site.toAct");
  return (
    <div className="flex bg-white gap-4 justify-center items-center">
      <button
        className={`border border-2 rounded-xl border-v2-blue py-1 px-3 cta tracking-wider hover:scale-105 ${activeSection === "individual" ? "bg-v2-blue text-v2-pink" : "bg-white"}`}
        onClick={() => setActiveSection("individual")}
      >
        {t("tags.individual")}
      </button>
      <button
        className={`border border-2 rounded-xl border-v2-blue py-1 px-3 cta tracking-wider hover:scale-105 ${activeSection === "company" ? "bg-v2-blue text-v2-pink" : "bg-white"}`}
        onClick={() => setActiveSection("company")}
      >
        {t("tags.company")}
      </button>
    </div>
  );
};
