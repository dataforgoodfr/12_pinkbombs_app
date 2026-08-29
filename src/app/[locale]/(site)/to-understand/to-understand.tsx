"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useState } from "react";
import "@/lib/env";

import ArticlesBlock from "@/components/v2/ArticlesBlock";
import DebunkBlock, {
  DebunkProps as DebunkBlockProps,
} from "@/components/v2/blocks/DebunkBlock";
import IllustratedDebunkBlock, {
  IllustratedDebunkBlockProps,
} from "@/components/v2/blocks/IllustratedDebunkBlock";
import CalculatorBlock from "@/components/v2/CalculatorBlock";

const ToUnderstand = () => {
  return (
    <>
      <IntroSection />
      <DebunkSection />
      <CalculatorBlock />
      <ArticlesBlock page="toUnderstand" />
    </>
  );
};

export default ToUnderstand;

const IntroSection = () => {
  const t = useTranslations("site.toUnderstand");

  return (
    <section className="bg-v2-blue text-v2-pink">
      <Image
        loading="lazy"
        src="/site/images/to-understand/intro.svg"
        width={1512}
        height={477}
        alt={t("intro.imageAlt")}
        className="object-contain h-auto mx-auto lg:pt-24 xl:w-[2000px]"
      />
    </section>
  );
};

const DebunkSection = () => {
  const t = useTranslations("site.toUnderstand");
  const [activeSection, setActiveSection] = useState<"act1" | "act2" | "act3">(
    "act1",
  );
  const firstActItems = t.raw(
    "debunk.act1.items",
  ) as IllustratedDebunkBlockProps[];
  const secondActItems = t.raw(
    "debunk.act2.items",
  ) as IllustratedDebunkBlockProps[];
  const thirdActItems = t.raw("debunk.act3.items") as DebunkBlockProps[];

  const handleSectionToggle = (section: "act1" | "act2" | "act3") => {
    const sectionElement = document.getElementById(`${section}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(section);
  };

  // if user scrolls down, we want to set the active section based on the scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const firstActSection = document.getElementById("act1");
      const secondActSection = document.getElementById("act2");
      const thirdActSection = document.getElementById("act3");
      if (firstActSection && secondActSection && thirdActSection) {
        const firstActTop = firstActSection.getBoundingClientRect().top;
        const secondActTop = secondActSection.getBoundingClientRect().top;
        const thirdActTop = thirdActSection.getBoundingClientRect().top;

        if (
          firstActTop < window.innerHeight / 2 &&
          secondActTop > window.innerHeight / 2
        ) {
          setActiveSection("act1");
        } else if (
          secondActTop < window.innerHeight / 2 &&
          thirdActTop > window.innerHeight / 2
        ) {
          setActiveSection("act2");
        } else if (thirdActTop < window.innerHeight / 2) {
          setActiveSection("act3");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <section id="act1" className="bg-white text-v2-blue">
        <div className="px-8 py-12 xl:max-w-[1279px] mx-auto">
          <SectionButtons
            sectionDisplayed="act1"
            activeSection={activeSection}
            setActiveSection={handleSectionToggle}
          />
          <h1 className="h1 text-v2-blue">{t("debunk.act1.title")}</h1>
          <div className="flex flex-col py-10 gap-12">
            {firstActItems.map((item, index) => (
              <IllustratedDebunkBlock
                key={`act1-item-${index}`}
                {...item}
                falseBelief={item.falseBelief}
                reality={item.reality}
                imageAlt={item.imageAlt}
                catchPhrase={item.catchPhrase}
                actNumber={1}
                index={index}
              />
            ))}
          </div>
        </div>
        <Image
          loading="lazy"
          src="/site/images/to-understand/act2-divider.svg"
          width={1510}
          height={48}
          alt="Divider"
          className="object-cover xl:w-[2000px]"
        />
      </section>
      <section id="act2" className="bg-white  text-v2-blue">
        <div className="px-14 py-16 xl:max-w-[1279px] mx-auto">
          <SectionButtons
            sectionDisplayed="act2"
            activeSection={activeSection}
            setActiveSection={handleSectionToggle}
          />
          <h1 className="h1 text-v2-blue">{t("debunk.act2.title")}</h1>
          <div className="flex flex-col py-10 gap-12">
            {secondActItems.map((item, index) => (
              <IllustratedDebunkBlock
                key={`act2-item-${index}`}
                {...item}
                falseBelief={item.falseBelief}
                reality={item.reality}
                imageAlt={item.imageAlt}
                catchPhrase={item.catchPhrase}
                actNumber={2}
                index={index}
              />
            ))}
          </div>
        </div>
        <Image
          loading="lazy"
          src="/site/images/to-understand/act3-divider.svg"
          width={1510}
          height={48}
          alt="Divider"
          className="object-cover xl:w-[2000px]"
        />
      </section>
      <section id="act3" className="bg-v2-blue text-v2-blue">
        <div className="px-14 py-16 xl:max-w-[1279px] mx-auto">
          <SectionButtons
            sectionDisplayed="act3"
            activeSection={activeSection}
            setActiveSection={handleSectionToggle}
          />
          <h1 className="h1 text-center text-v2-pink">
            {t("debunk.act3.title")}
          </h1>
          <div className="flex flex-col py-10 gap-12">
            {thirdActItems.map((item, index) => (
              <DebunkBlock
                key={`act3-item-${index}`}
                {...item}
                falseBelief={item.falseBelief}
                reality={item.reality}
                actNumber={3}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const SectionButtons = ({
  sectionDisplayed,
  activeSection,
  setActiveSection,
}: {
  sectionDisplayed: "act1" | "act2" | "act3";
  activeSection: "act1" | "act2" | "act3";
  setActiveSection: (section: "act1" | "act2" | "act3") => void;
}) => {
  const t = useTranslations("site.toUnderstand");
  const activeTagColor =
    sectionDisplayed === "act1" || sectionDisplayed === "act2"
      ? "bg-v2-blue text-v2-pink"
      : "bg-black text-v2-pink";
  const inactiveTagColor =
    sectionDisplayed === "act1" || sectionDisplayed === "act2"
      ? "bg-white text-v2-blue"
      : "bg-v2-blue text-v2-pink";
  const borderColor =
    sectionDisplayed === "act3" ? "border-v2-pink" : "border-v2-blue";
  return (
    <div
      className={`flex gap-4 mb-6 ${sectionDisplayed === "act1" || sectionDisplayed === "act2" ? "justify-start" : "justify-center"}`}
    >
      <button
        className={`${activeSection === "act1" ? "border-none" : "border border-2"} ${borderColor}  rounded-xl py-1 px-3 cta tracking-wider hover:scale-105 ${activeSection === "act1" ? activeTagColor : inactiveTagColor}`}
        onClick={() => setActiveSection("act1")}
      >
        {t("tags.act1")}
      </button>
      <button
        className={`${activeSection === "act2" ? "border-none" : "border border-2"} ${borderColor}  rounded-xl py-1 px-3 cta tracking-wider hover:scale-105 ${activeSection === "act2" ? activeTagColor : inactiveTagColor}`}
        onClick={() => setActiveSection("act2")}
      >
        {t("tags.act2")}
      </button>
      <button
        className={`${activeSection === "act3" ? "border-none" : "border border-2"}  ${borderColor} rounded-xl py-1 px-3 cta tracking-wider hover:scale-105 ${activeSection === "act3" ? activeTagColor : inactiveTagColor}`}
        onClick={() => setActiveSection("act3")}
      >
        {t("tags.act3")}
      </button>
    </div>
  );
};
