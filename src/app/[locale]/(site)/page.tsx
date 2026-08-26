"use client";

import React from "react";
import clsx from "clsx";

import type { MenuCardProps } from "@/components/v2/cards/MenuCard";
import { useTranslations } from "next-intl";
import "@/lib/env";

import Image from "next/image";
import MenuCard from "@/components/v2/cards/MenuCard";
import CalculatorBlock from "@/components/v2/CalculatorBlock";
import ArticlesBlock from "@/components/v2/ArticlesBlock";

const HomePage = () => {
  const t = useTranslations("story");

  return (
    <>
      <HeroSection />
      <ExplodeSection />
      <ImpactSection />
      <MenuSection />
      <AdditionSection />
      <CalculatorBlock />
      <ArticlesBlock />
    </>
  );
};

export default HomePage;

const HeroSection = () => {
  const t = useTranslations("site.homepage");
  return (
    <section className="flex mt-26 pt-40 px-10 min-h-[300px] h-screen text-v2-pink bg-v2-blue">
      <div className="grid grid-rows-[1fr, auto, 1fr] w-full">
        <Image
          loading="lazy"
          src="/site/images/homepage/fish-plate.svg"
          width={571}
          height={425}
          alt={t("hero.imageAlt")}
          className="object-contain mx-auto"
        />
        <div className="row-start-3 items-left flex gap-2 max-w-[50%]">
          <p className={clsx("h1", "max-w-[1500px] mx-auto w-full")}>
            {t("hero.title")}
          </p>
        </div>
      </div>
    </section>
  );
};

const ExplodeSection = () => {
  const t = useTranslations("site.homepage");

  return (
    <section className="relative flex flex-col text-black bg-v2-pink min-h-[760px]">
      <svg width="1512" height="49" viewBox="0 0 1512 49" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1512" height="49" fill="#13176E"/>
        <path d="M0.5 49L29.1364 1L137.773 49L166.409 1L275.045 49L303.682 1L412.318 49L440.955 1L549.591 49L578.227 1L686.864 49L715.5 1L824.136 49L852.773 1L961.409 49L990.046 1L1098.68 49L1127.32 1L1235.95 49L1264.59 1L1373.23 49L1401.86 1L1510.5 49H1373.23H1235.95H1098.68H961.409H824.136H686.864H549.591H412.318H275.045H137.773H0.5Z" fill="#FFD4D4"/>
      </svg>
      <Image
        loading="lazy"
        src="/site/images/homepage/fish-bomb.svg"
        width={1130}
        height={692}
        alt={t("bomb.imageAlt")}
        className="pt-24 object-contain mx-auto"
      />
      <div className="absolute px-10 bottom-6 flex row-start-3 items-left flex gap-2 max-w-[60%]">
        <p className="h1">
          {t("bomb.title")}
        </p>
      </div>
    </section>
  );
};

const ImpactSection = () => {
  const t = useTranslations("site.homepage");
  return (
    <section className="relative flex flex-col px-16 text-black bg-v2-blue max-w-[1512px] mx-auto">
      <Image
        loading="lazy"
        src="/site/images/homepage/divider-impact-section.svg"
        width={1130}
        height={692}
        alt="Page divider"
        className="object-cover mx-auto"
      />
      <div className="flex flex-col py-20 space-between gap-6 lg:gap-12">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col flex-1 text-v2-pink max-w-[50%]">
            <p className="h2">
              {t("impact.title")}
            </p>
            <p className="h2 text-v2-red">
              {t("impact.titleHighlight")}
            </p>
            <p className="p-lead pt-2">
              {t("impact.impact")}
            </p>
          </div>
          <Image
            loading="lazy"
            src="/site/images/homepage/eiffel-towers.svg"
            width={611}
            height={179}
            alt={t("impact.imageAltTitle")}
            className="block flex-1 object-contain max-w-[611px] mx-auto"
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col flex-1 text-v2-pink max-w-[48%]">
            <p className="h2">
              {t("impact.title2")}
            </p>
            <p className="h2 text-v2-red">
              {t("impact.title2Highlight")}
            </p>
            <p className="p-lead pt-2">
              {t("impact.description")}
            </p>
          </div>
          <Image
            loading="lazy"
            src="/site/images/homepage/salmons.svg"
            width={646}
            height={59}
            alt={t("impact.imageAltDescription")}
            className="object-contain flex-1 max-w-[646px] mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

const MenuSection = () => {
  const t = useTranslations("site.homepage");
  const menuCardItems = t.raw("menu.menuCards") as MenuCardProps[];
  return (
    <section className="relative flex flex-col bg-white mx-auto">
      <svg width="1512" height="49" viewBox="0 0 1512 49" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1512" height="49" fill="#13176E"/>
        <path d="M0.5 49L29.1364 1L137.773 49L166.409 1L275.045 49L303.682 1L412.318 49L440.955 1L549.591 49L578.227 1L686.864 49L715.5 1L824.136 49L852.773 1L961.409 49L990.046 1L1098.68 49L1127.32 1L1235.95 49L1264.59 1L1373.23 49L1401.86 1L1510.5 49H1373.23H1235.95H1098.68H961.409H824.136H686.864H549.591H412.318H275.045H137.773H0.5Z" fill="white"/>
      </svg>

      <div className="flex flex-col py-20 space-between gap-6 lg:gap-12 max-w-[658px] mx-auto">
        <p className="h2 text-center mt-4">
          <span className="text-v2-red">{t("menu.title.part1")}{" "}</span>
          <span className="text-v2-blue">{t("menu.title.part2")}{" "}</span>
          <span className="text-v2-red">{t("menu.title.part3")}</span>
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 px-32 pb-20">
        {menuCardItems.map((item, index) => (
          <MenuCard
            key={index}
            className="mx-auto"
            title={item.title}
            content={<span dangerouslySetInnerHTML={{ __html: item.content }} />}
            imageAlt={item.imageAlt}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

const AdditionSection = () => {
  const t = useTranslations("site.homepage");
  return (
    <section className="relative flex flex-col bg-[#FF5029] mx-auto pb-32">
        <svg width="1512" height="40" viewBox="0 0 1512 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1567_12957)">
        <rect width="1512" height="40" fill="#FF5029"/>
        <path d="M700.168 -15.832H811.832L756 40L700.168 -15.832Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_1567_12957">
        <rect width="1512" height="40" fill="white"/>
        </clipPath>
        </defs>
      </svg>
      <div className="flex flex-col py-8 max-w-[703px] mx-auto">
        <p className="h2 text-center mt-4 text-black">
          {t("addition.title.part1")}{" "}
          <span className="text-white">{t("addition.title.part2")}{" "}</span>
        </p>
      </div>
      <div className="flex flex-col rotate-[3deg] bg-v2-pink text-black mt-8 pt-8 px-12 space-between gap-4 w-[60%] mx-auto rounded-lg">
        <div className="flex flex-col gap-10">
          <p className="h3 italic">
            {t("addition.results.intro")}
          </p>
          <div className="grid grid-rows-4">
            <div className="flex flex-row justify-start items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/salmons.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item1.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h2">{t("addition.results.resultItems.item1.title")}</span>{" "}
                <span className="p-lead">{t("addition.results.resultItems.item1.description")}</span>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-thin-divider.svg"
              width={725}
              height={0}
              alt="Divider"
              className="-rotate-[2.2deg] my-4"
            />
            <div className="flex flex-row justify-start items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/cereal.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item2.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h2">{t("addition.results.resultItems.item2.title")}</span>{" "}
                <span className="p-lead">{t("addition.results.resultItems.item2.description")}</span>
              </div>
              </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-thin-divider.svg"
              width={725}
              height={0}
              alt="Divider"
              className="-rotate-[2.2deg] my-4"
            />
            <div className="flex flex-row justify-start items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/carbon.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item3.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h2">{t("addition.results.resultItems.item3.title")}</span>{" "}
                <span className="p-lead">{t("addition.results.resultItems.item3.description")}</span>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-thin-divider.svg"
              width={725}
              height={0}
              alt="divider"
              className="-rotate-[2.2deg] my-4"
            />
            <div className="flex flex-row justify-start items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/farmed-fishes.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item4.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h2">{t("addition.results.resultItems.item4.title")}</span>{" "}
                <span className="p-lead">{t("addition.results.resultItems.item4.description")}</span>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-heavy-divider.svg"
              width={725}
              height={0}
              alt="Divider"
              className="-rotate-[2.2deg] mt-6"
            />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <p className="h3 italic">
            {t("addition.addOns.intro")}
          </p>
          <div className="flex flex-col gap-8">
            <div className="flex flex-row justify-start items-start gap-2 border-bottom">
              <Image
                loading="lazy"
                src="/site/images/components/water.svg"
                width={81}
                height={81}
                alt={t("addition.addOns.addOnItems.item1.imageAlt")}
                className="mr-4"
              />
              <div>
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
            <div className="flex flex-row justify-start items-start gap-2 border-bottom">
              <Image
                loading="lazy"
                src="/site/images/components/salmons.svg"
                width={81}
                height={81}
                alt={t("addition.addOns.addOnItems.item2.imageAlt")}
                className="mr-4"
              />
              <div>
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
            <div className="flex flex-row justify-start items-start gap-2 border-bottom">
              <Image
                loading="lazy"
                src="/site/images/components/bottle.svg"
                width={81}
                height={81}
                alt={t("addition.addOns.addOnItems.item3.imageAlt")}
                className="mr-4"
              />
              <div>
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
            <div className="flex flex-row justify-start items-start gap-2 border-bottom">
              <Image
                loading="lazy"
                src="/site/images/components/omega3.svg"
                width={81}
                height={81}
                alt={t("addition.addOns.addOnItems.item4.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h4">
                  {t("addition.addOns.addOnItems.item4.title")}
                </span>{" "}
                <span className="p preserve-lines">
                  {t.rich("addition.addOns.addOnItems.item4.description", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </span>
              </div>
            </div>
            <Image
              loading="lazy"
              src="/site/images/homepage/addition-heavy-divider.svg"
              width={725}
              height={0}
              alt="Divider"
              className="object-contain -rotate-[2.2deg]"
            />
          </div>
        </div>
        <div className="relative -mb-36">
          <p className="h3 italic">
            {t("addition.total")}
          </p>
          <Image
            loading="lazy"
            src="/site/images/homepage/boom.svg"
            width={771}
            height={380}
            alt={t("bomb.imageAlt")}
            className="relative -top-32 -rotate-[2.2deg] object-contain mx-auto"
          />
        </div>
      </div>
      <Image
        loading="lazy"
        src="/site/images/homepage/calculator-divider.svg"
        width={1512}
        height={53}
        alt="divider"
        className="absolute bottom-0 object-contain mx-auto"
      />
    </section>
  );
};  