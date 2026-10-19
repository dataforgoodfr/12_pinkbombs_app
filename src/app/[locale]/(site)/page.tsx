"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import CalculatorBlock from "@/components/v2/CalculatorBlock";
import type { MenuCardProps } from "@/components/v2/cards/MenuCard";
import MenuCard from "@/components/v2/cards/MenuCard";
import ExplorationBlock from "@/components/v2/ExplorationBlock";
import HomepageIntro from "@/components/v2/HomepageIntro";

const HomePage = () => {
  return (
    <>
      <HomepageIntro />
      <ImpactSection />
      <MenuSection />
      <AdditionSection />
      <CalculatorBlock />
      <ExplorationBlock />
    </>
  );
};

export default HomePage;

const ImpactSection = () => {
  const t = useTranslations("site.homepage");
  return (
    <section
      id="homepage-impact"
      tabIndex={-1}
      className="relative flex flex-col px-10 lg:px-16 text-black bg-v2-blue mx-auto"
    >
      <div className="max-w-[1512px] mx-auto">
        <div className="flex flex-col py-20 space-between gap-20 lg:gap-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 items-center justify-between max-w-[1512px]">
            <Image
              loading="lazy"
              src="/site/images/homepage/eiffel-towers.svg"
              width={611}
              height={239}
              alt={t("impact.imageAltTitle")}
              className="block flex-1 object-contain lg:max-w-[611px] mx-auto h-auto"
            />
            <div className="flex flex-col flex-1 text-v2-pink md:px-10 lg:px-16 lg:max-w-[50%] mr-auto">
              <p className="h2">{t("impact.title")}</p>
              <p className="h2 text-v2-red">{t("impact.titleHighlight")}</p>
              <p className="p-lead pt-2 text-pretty">{t("impact.impact")}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 items-center justify-between">
            <Image
              loading="lazy"
              src="/site/images/homepage/salmons.svg"
              width={596}
              height={59}
              alt={t("impact.imageAltDescription")}
              className="block flex-1 object-contain md:w-[48%] lg:max-w-[460px] lg:max-w-full mx-auto h-auto"
            />
            <div className="flex flex-col flex-1 text-v2-pink md:px-10 lg:px-16 lg:max-w-[80%] xl:max-w-[50%]">
              <p className="h2 text-pretty">{t("impact.title2")}</p>
              <p className="h2 text-v2-red">{t("impact.title2Highlight")}</p>
              <p className="p-lead pt-2 text-pretty">
                {t("impact.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuSection = () => {
  const t = useTranslations("site.homepage");
  const tAbout = useTranslations("site.about");
  const menuCardItems = t.raw("menu.menuCards") as MenuCardProps[];
  return (
    <section className="relative flex flex-col bg-white mx-auto ">
      <div className="bg-v2-blue bg-[url(/site/images/homepage/divider-menu-section.svg)] bg-top bg-repeat-x w-full h-[49px] -mt-px" />
      <div className="max-w-[1512px] mx-auto">
        <div className="flex flex-col px-4 py-20 lg:px-0 space-between gap-6 lg:gap-12 max-w-[658px] mx-auto">
          <p className="h2 text-center mt-4 text-pretty">
            <span className="text-v2-red">{t("menu.title.part1")} </span>
            <span className="text-v2-blue">{t("menu.title.part2")} </span>
            <span className="text-v2-red">{t("menu.title.part3")}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-2 gap-4 px-6 lg:px-32">
          {menuCardItems.map((item, index) => (
            <MenuCard
              key={index}
              className="mx-auto"
              title={item.title}
              content={
                <span dangerouslySetInnerHTML={{ __html: item.content }} />
              }
              imageAlt={item.imageAlt}
              index={index}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 pt-10 pb-20">
          {t("menu.detail")}{" "}
          <span>
            <a
              className="underline hover:text-v2-magenta"
              href={`/about#${tAbout("method.sectionId")}`}
            >
              {t("menu.methodology")}.
            </a>
          </span>
        </p>
      </div>
    </section>
  );
};

const AdditionSection = () => {
  const t = useTranslations("site.homepage");
  return (
    <section className="relative flex flex-col bg-[#FF5029] mx-auto pb-20 lg:pb-32">
      <Image
        loading="lazy"
        src="/site/images/homepage/divider-addition-section.svg"
        width={1512}
        height={40}
        alt="Page divider"
        className="object-cover mx-auto"
      />
      <div className="flex flex-col py-8 max-w-[703px] mx-4 lg:mx-auto">
        <p className="h2 text-center mt-4 text-black text-pretty">
          {t("addition.title.part1")}{" "}
          <span className="text-white">{t("addition.title.part2")} </span>
        </p>
      </div>
      <div className="flex flex-col lg:rotate-[3deg] bg-v2-pink text-black mt-8 pt-8 px-6 lg:px-12 space-between gap-4 lg:w-[60%] mx-4 lg:mx-auto rounded-lg">
        <div className="flex flex-col gap-10 text-pretty">
          <p className="h5 uppercase text-[22px] italic">
            {t("addition.results.intro")}
          </p>
          <div className="lg:grid grid-rows-4">
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/farmed-fishes.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item1.imageAlt")}
                className="mr-4"
              />
              <div className="flex flex-col gap-2">
                <h3 className="h3 text-pretty">
                  {t("addition.results.resultItems.item1.title")}
                </h3>{" "}
                <p className="p-lead">
                  {t("addition.results.resultItems.item1.description")}
                </p>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-thin-divider.svg"
              width={725}
              height={32}
              alt="Divider"
              className="-rotate-[2.2deg] my-4 h-auto"
            />
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/salmons.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item2.imageAlt")}
                className="mr-4"
              />
              <div className="flex flex-col gap-2">
                <h3 className="h3 text-pretty">
                  {t("addition.results.resultItems.item2.title")}
                </h3>{" "}
                <p className="p-lead">
                  {t("addition.results.resultItems.item2.description")}
                </p>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-thin-divider.svg"
              width={725}
              height={32}
              alt="Divider"
              className="-rotate-[2.2deg] my-4 h-auto"
            />
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/water.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item3.imageAlt")}
                className="mr-4"
              />
              <div className="flex flex-col gap-2">
                <h3 className="h3 text-pretty">
                  {t("addition.results.resultItems.item3.title")}
                </h3>{" "}
                <p className="p-lead">
                  {t("addition.results.resultItems.item3.description")}
                </p>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-thin-divider.svg"
              width={725}
              height={32}
              alt="divider"
              className="-rotate-[2.2deg] my-4 h-auto"
            />
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/carbon.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item4.imageAlt")}
                className="mr-4"
              />
              <div className="flex flex-col gap-2">
                <h3 className="h3 text-pretty">
                  {t("addition.results.resultItems.item4.title")}
                </h3>{" "}
                <p className="p-lead">
                  {t("addition.results.resultItems.item4.description")}
                </p>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-heavy-divider.svg"
              width={676}
              height={35}
              alt="Divider"
              className="w-[725px] h-auto -rotate-[2.2deg] mt-6"
            />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <p className="h3 italic text-pretty">{t("addition.addOns.intro")}</p>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2 border-bottom">
              <Image
                loading="lazy"
                src="/site/images/components/cereal.svg"
                width={81}
                height={81}
                alt={t("addition.addOns.addOnItems.item1.imageAlt")}
                className="mr-4"
              />
              <div className="flex flex-col gap-2">
                <span className="h4">
                  {t("addition.addOns.addOnItems.item1.title")}
                </span>{" "}
                <span className="p">
                  {t.rich("addition.addOns.addOnItems.item1.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2 border-bottom">
              <Image
                loading="lazy"
                src="/site/images/components/salmons.svg"
                width={81}
                height={81}
                alt={t("addition.addOns.addOnItems.item2.imageAlt")}
                className="mr-4"
              />
              <div className="flex flex-col gap-2">
                <span className="h4">
                  {t("addition.addOns.addOnItems.item2.title")}
                </span>{" "}
                <span className="p preserve-lines">
                  {t.rich("addition.addOns.addOnItems.item2.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2 border-bottom">
              <Image
                loading="lazy"
                src="/site/images/components/omega3.svg"
                width={81}
                height={81}
                alt={t("addition.addOns.addOnItems.item3.imageAlt")}
                className="mr-4"
              />
              <div className="flex flex-col gap-2">
                <span className="h4">
                  {t("addition.addOns.addOnItems.item3.title")}
                </span>{" "}
                <span className="p">
                  {t.rich("addition.addOns.addOnItems.item3.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </span>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-heavy-divider.svg"
              width={676}
              height={35}
              alt="Divider"
              className="w-[725px] h-auto object-contain -rotate-[2.2deg]"
            />
          </div>
        </div>
        <div className="relative -mb-6 lg:-mb-36">
          <p className="h3 italic text-pretty">{t("addition.total")}</p>
          <Image
            loading="lazy"
            src="/site/images/homepage/boom.svg"
            width={771}
            height={380}
            alt={t("bomb.imageAlt")}
            className="relative -top-4 lg:-top-32 -rotate-[2.2deg] object-contain mx-auto"
          />
        </div>
      </div>
      <svg
        className="absolute -bottom-px left-0 block w-full h-auto"
        preserveAspectRatio="none"
        width="1512"
        height="53"
        viewBox="0 0 1512 53"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1544_8468)">
          <rect width="1512" height="53" fill="#FF5029" />
          <path
            d="M-0.5 21.9809C-0.5 21.9809 108.206 -3.40926 242.838 6.69336C375.925 16.6828 506.201 81.6094 787.788 39.8903C929.538 18.8926 1086.56 -24.8915 1268.95 16.6782C1427.5 52.814 1511.5 26.1469 1511.5 26.1469V170.391H-0.5V21.9763V21.9809Z"
            fill="#13176E"
          />
        </g>
        <defs>
          <clipPath id="clip0_1544_8468" clipPathUnits="userSpaceOnUse">
            <rect width="1512" height="53" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
};
