"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useState } from "react";
import "@/lib/env";

import DebunkBlock, { DebunkProps } from "@/components/v2/blocks/DebunkBlock";
import IllustratedDebunkBlock, {
  IllustratedDebunkProps,
} from "@/components/v2/blocks/IllustratedDebunkBlock";
import CalculatorBlock from "@/components/v2/CalculatorBlock";
import ExplorationBlock from "@/components/v2/ExplorationBlock";

const ToUnderstand = () => {
  return (
    <>
      <IntroSection />
      <DebunkSection />
      <CalculatorBlock />
      <ExplorationBlock page="toUnderstand" />
    </>
  );
};

export default ToUnderstand;

const IntroSection = () => {
  const t = useTranslations("site.toUnderstand");

  return (
    <section className="bg-v2-blue text-v2-pink">
      <div className="flex flex-col lg:flex-row px-12 pt-12 pb-10 md:pb-14 lg:pb-36 xl:pb-24 lg:pt-40 lg:pl-24 gap-12 lg:gap-0 justify-center mx-auto">
        <div className="flex flex-col gap-4 z-10 lg:w-[40%]">
          <h4 className="h4 text-pretty">{t("intro.caption")}</h4>
          <h1 className="h1 text-pretty">{t("intro.title")}</h1>
        </div>
        <div className="flex flex-col lg:w-[60%]">
          <Image
            loading="lazy"
            src="/site/images/to-understand/intro.svg"
            width={1796}
            height={415}
            alt={t("intro.imageAlt")}
            className="relative right-14 md:right-0 md:left-2 lg:-left-20 lg:top-32 xl:top-2 z-0 object-contain scale-[150%] md:scale-[110%] lg:scale-[150%] xl:scale-[130%]"
          />
        </div>
      </div>
      <div className="z-2 relative -mt-8 md:-mt-20 lg:-mt-20 xl:-mt-28 2xl:-mt-32">
        <Image
          loading="lazy"
          src="/site/images/to-understand/intro-divider.svg"
          width={1512}
          height={103}
          alt={t("intro.imageAlt")}
          className="object-cover4 md:w-[1024px] lg:w-[1440px] xl:w-[2000px]"
        />
      </div>
    </section>
  );
};

const DebunkSection = () => {
  const t = useTranslations("site.toUnderstand");
  const [activeSection, setActiveSection] = useState<"block1" | "block2" | "block3">(
    "block1",
  );
  const firstActItems = t.raw("debunk.block1.items") as IllustratedDebunkProps[];
  const secondActItems = t.raw("debunk.block2.items") as IllustratedDebunkProps[];
  const thirdActItems = t.raw("debunk.block3.items") as DebunkProps[];

  const handleSectionToggle = (section: "block1" | "block2" | "block3") => {
    const sectionElement = document.getElementById(`${section}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(section);
  };

  // if user scrolls down, we want to set the active section based on the scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const firstActSection = document.getElementById("block1");
      const secondActSection = document.getElementById("block2");
      const thirdActSection = document.getElementById("block3");
      if (firstActSection && secondActSection && thirdActSection) {
        const firstActTop = firstActSection.getBoundingClientRect().top;
        const secondActTop = secondActSection.getBoundingClientRect().top;
        const thirdActTop = thirdActSection.getBoundingClientRect().top;

        if (
          firstActTop < window.innerHeight / 2 &&
          secondActTop > window.innerHeight / 2
        ) {
          setActiveSection("block1");
        } else if (
          secondActTop < window.innerHeight / 2 &&
          thirdActTop > window.innerHeight / 2
        ) {
          setActiveSection("block2");
        } else if (thirdActTop < window.innerHeight / 2) {
          setActiveSection("block3");
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <section id="block1" className="bg-white text-v2-blue">
        <div className="px-8 py-12 xl:max-w-[1279px] mx-auto">
          <SectionButtons
            sectionDisplayed="block1"
            activeSection={activeSection}
            setActiveSection={handleSectionToggle}
          />
          <h1 className="h1 text-v2-blue text-pretty">
            {t("debunk.block1.title")}
          </h1>
          <div className="flex flex-col py-10 gap-12">
            {firstActItems.map((item, index) => (
              <IllustratedDebunkBlock
                key={`block1-item-${index}`}
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
          src="/site/images/to-understand/block2-divider.svg"
          width={1510}
          height={48}
          alt=""
          className="object-cover xl:w-[2000px]"
        />
      </section>
      <section id="block2" className="bg-white  text-v2-blue">
        <div className="px-14 py-16 xl:max-w-[1279px] mx-auto">
          <SectionButtons
            sectionDisplayed="block2"
            activeSection={activeSection}
            setActiveSection={handleSectionToggle}
          />
          <h1 className="h1 text-v2-blue text-pretty">
            {t("debunk.block2.title")}
          </h1>
          <div className="flex flex-col py-10 gap-12">
            {secondActItems.map((item, index) => (
              <IllustratedDebunkBlock
                key={`block2-item-${index}`}
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
          src="/site/images/to-understand/block3-divider.svg"
          width={1510}
          height={48}
          alt=""
          className="object-cover xl:w-[2000px]"
        />
      </section>
      <section id="block3" className="bg-v2-blue text-v2-blue">
        <div className="px-14 pt-16 lg:py-16 xl:max-w-[1279px] mx-auto">
          <SectionButtons
            sectionDisplayed="block3"
            activeSection={activeSection}
            setActiveSection={handleSectionToggle}
          />
          <h1 className="h1 text-center text-v2-pink text-pretty">
            {t("debunk.block3.title")}
          </h1>
          <div className="flex flex-col py-10 gap-12">
            {thirdActItems.map((item, index) => (
              <DebunkBlock
                key={`block3-item-${index}`}
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
  sectionDisplayed: "block1" | "block2" | "block3";
  activeSection: "block1" | "block2" | "block3";
  setActiveSection: (section: "block1" | "block2" | "block3") => void;
}) => {
  const t = useTranslations("site.toUnderstand");
  const activeTagColor =
    sectionDisplayed === "block1" || sectionDisplayed === "block2"
      ? "bg-v2-blue text-v2-pink"
      : "bg-black text-v2-pink";
  const inactiveTagColor =
    sectionDisplayed === "block1" || sectionDisplayed === "block2"
      ? "bg-white text-v2-blue"
      : "bg-v2-blue text-v2-pink";
  const borderColor =
    sectionDisplayed === "block3" ? "border-v2-pink" : "border-v2-blue";
  return (
    <div
      className={`flex flex-col md:flex-row gap-4 mb-6 ${sectionDisplayed === "block1" || sectionDisplayed === "block2" ? "justify-start" : "justify-center"}`}
    >
      <button
        className={`${activeSection === "block1" ? "border-none" : "border border-2"} ${borderColor}  rounded-xl py-1 px-3 cta tracking-wider hover:scale-105 ${activeSection === "block1" ? activeTagColor : inactiveTagColor}`}
        onClick={() => setActiveSection("block1")}
      >
        {t("tags.block1")}
      </button>
      <button
        className={`${activeSection === "block2" ? "border-none" : "border border-2"} ${borderColor}  rounded-xl py-1 px-3 cta tracking-wider hover:scale-105 ${activeSection === "block2" ? activeTagColor : inactiveTagColor}`}
        onClick={() => setActiveSection("block2")}
      >
        {t("tags.block2")}
      </button>
      <button
        className={`${activeSection === "block3" ? "border-none" : "border border-2"}  ${borderColor} rounded-xl py-1 px-3 cta tracking-wider hover:scale-105 ${activeSection === "block3" ? activeTagColor : inactiveTagColor}`}
        onClick={() => setActiveSection("block3")}
      >
        {t("tags.block3")}
      </button>
    </div>
  );
};
