"use client";

import clsx from "clsx";
import Link from "next/link";
import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import Chart from "@/components/v1/Chart";
import Edito from "@/components/v1/Edito";
import IconCard from "@/components/v1/IconCard";
import MetaChart from "@/components/v1/MetaChart";
import Image from "next/image";

const HomePage = () => {
  const t = useTranslations("story");

  return (
    <>
      <HeroSection />
      <ExplodeSection />
      <ImpactSection />
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
    <section className="relative flex flex-col px-16 text-black bg-v2-blue min-h-[760px] max-w-[1512px] mx-auto">
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

const BusinessSection = () => {
  const t = useTranslations("story");

  return (
    <section className="p-6 lg:px-12 lg:pt-36 lg:pb-64 text-white bg-darkblue1">
      <div className="max-w-[1500px] mx-auto">
        <h2 className={clsx("h3", "mb-4 lg:mb-6 max-w-5xl m-auto text-center")}>
          {t("industry.title")}
        </h2>
        <p className="mb-6 lg:mb-14 max-w-xl text-white m-auto text-center">
          {t("industry.content")}
        </p>
        <Chart id="hyper-growth-grouped" />
        <MetaChart
          hasBackground={false}
          data={[
            {
              type: "source",
              link: t("industry.source"),
              isBlank: true,
            },
            {
              type: "methodology",
              link: "/about#macro-hyper-growth-section",
            },
            {
              type: "data",
              link: t("industry.data"),
              artifact: t("industry.artifact"),
            },
            {
              type: "image",
              isBlank: true,
              link: t("industry.image"),
            },
          ]}
        />
        <div className="flex justify-center">
          <Link
            className="inline-flex justify-center mt-6 lg:mt-12 p-4 lg:text-xl text-white bg-red1 font-secondary uppercase rounded-xl tracking-widest border-2 border-red1 hover:bg-darkblue1 hover:text-red1 transition-all ease-in-out duration-100"
            href="/archive/v1/to-act"
          >
            {t("industry.link")}
          </Link>
        </div>
      </div>
    </section>
  );
};
