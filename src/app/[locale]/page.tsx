"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import Chart from "@/components/Chart";
import Edito from "@/components/Edito";
import IconCard from "@/components/IconCard";
import IntroBlock from "@/components/IntroBlock";
import JoinBlock from "@/components/JoinBlock";
import MetaChart from "@/components/MetaChart";

const HomePage = () => {
  const t = useTranslations("story");

  return (
    <>
      <IntroBlock title={t("title")} image="/images/salmon.svg" />

      <BombSection />
      <VideoSection />
      <ExplodeSection />
      <EditoSection />
      <BusinessSection />

      <JoinBlock />
    </>
  );
};

export default HomePage;

const BombSection = () => {
  const t = useTranslations("story");

  return (
    <section className="flex p-6 lg:p-12 min-h-[300px] h-screen text-red2 bg-darkblue1 bg-[url('/images/background-bombs.svg')] bg-[length:800px_400px] sm:bg-[length:1000px_500px] lg:bg-cover bg-no-repeat bg-center">
      <div className="grid grid-rows-[1fr, auto, 1fr] w-full">
        <div className="row-start-3 self-end items-left flex gap-2 items-end">
          <p className={clsx("h1", "max-w-[1500px] mx-auto w-full")}>
            {t("bomb")}
          </p>
        </div>
      </div>
    </section>
  );
};

const ExplodeSection = () => {
  const t = useTranslations("story");

  return (
    <section className="flex flex-col items-center justify-center p-6 lg:p-12 lg:pt-24 lg:pb-48 2xl:py-24 text-red2 bg-darkblue1 min-h-screen">
      <h2 className="h1 mb-12 lg:mb-24 max-w-[1500px] mx-auto">
        {t("explode.intro")}
      </h2>
      <ul
        className="
        grid grid-cols-1 xs:grid-cols-2 gap-8 list-none bg-no-repeat bg-center relative
        xs:bg-[url(/images/explose-small.svg)] xs:bg-[length:438px_320px]
        xl:bg-[url(/images/explose.svg)]
        xl:w-[969px] xl:h-[829px] xl:bg-[length:727px_662px]
        3xl:w-[1515px] 3xl:h-[1190px] 3xl:bg-[length:969px_829px]
      "
      >
        <li className="xl:absolute xl:-left-[20px] xl:top-[180px] 3xl:left-[112px] 3xl:top-[330px]">
          <IconCard
            icon="/images/storytelling/icon-social.svg"
            title={t("explode.social.title")}
            content={t("explode.social.content")}
          />
        </li>
        <li className="xl:absolute xl:left-[120px] xl:bottom-[20px] 3xl:left-[242px] 3xl:bottom-[180px]">
          <IconCard
            icon="/images/storytelling/icon-climate.svg"
            title={t("explode.climat.title")}
            content={t("explode.climat.content")}
          />
        </li>
        <li className="xl:absolute xl:-right-[150px] xl:top-[50px] 3xl:-right-[100px] 3xl:top-[160px]">
          <IconCard
            icon="/images/storytelling/icon-health.svg"
            title={t("explode.health.title")}
            content={t("explode.health.content")}
          />
        </li>
        <li className="xl:absolute xl:-right-[140px] xl:bottom-[140px] 3xl:-right-[80px] 3xl:bottom-[360px]">
          <IconCard
            icon="/images/storytelling/icon-biodiversity.svg"
            title={t("explode.biodiversity.title")}
            content={t("explode.biodiversity.content")}
          />
        </li>
        <li className="xl:absolute xl:right-[100px] xl:-bottom-[120px] 3xl:right-[340px] 3xl:bottom-[10px]">
          <IconCard
            icon="/images/storytelling/icon-animals.svg"
            title={t("explode.animals.title")}
            content={t("explode.animals.content")}
          />
        </li>
      </ul>
    </section>
  );
};

const VideoSection = () => {
  return (
    <div className="p-6 lg:px-12 lg:pt-36 lg:pb-64 text-red1 bg-pink1">
      <div className="max-w-[1500px] mx-auto">
        <div className="pt-[56.25%] relative">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/YPVHTczRyuU?si=BZA4TaWW86aayGRp&rel=0"
            title="Pinkbombs"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

const EditoSection = () => {
  const t = useTranslations("story");

  const editosContent = [
    {
      title: t("edito.biodiversity.title"),
      content: t("edito.biodiversity.content"),
      ctas: [{ target: "/dashboard#biodiversity-section", hasIcon: true }],
      image: {
        src: "/images/storytelling/biodiversity-hd.webp",
      },
    },
    {
      title: t("edito.health.title"),
      content: t("edito.health.content"),
      ctas: [{ target: "/dashboard#health-section", hasIcon: true }],
      image: {
        src: "/images/storytelling/health.jpg",
        caption: t("edito.health.credit"),
      },
    },
    {
      title: t("edito.climat.title"),
      content: t("edito.climat.content"),
      ctas: [{ target: "/dashboard#climate-section", hasIcon: true }],
      image: {
        src: "/images/storytelling/climate.jpg",
      },
    },
    {
      title: t("edito.social.title"),
      content: t("edito.social.content"),
      ctas: [{ target: "/dashboard#social-section", hasIcon: true }],
      image: {
        src: "/images/storytelling/social.jpg",
      },
    },
    {
      title: t("edito.animals.title"),
      content: t("edito.animals.content"),
      ctas: [{ target: "/dashboard#animals-section", hasIcon: true }],
      image: {
        src: "/images/storytelling/animals.jpg",
      },
    },
  ];

  return (
    <>
      {editosContent.map((edito, key) => (
        <Edito
          key={`edito-${key}`}
          {...edito}
          contentPosition={key % 2 ? "left" : "right"}
        />
      ))}
    </>
  );
};

const BusinessSection = () => {
  const t = useTranslations("story");

  return (
    <section className="p-6 lg:px-12 lg:pt-36 lg:pb-64 text-red2 bg-darkblue1">
      <div className="max-w-[1500px] mx-auto">
        <h3 className={clsx("h3", "mb-4 lg:mb-6 max-w-5xl m-auto text-center")}>
          {t("industry.title")}
        </h3>
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
            href="/to-act"
          >
            {t("industry.link")}
          </Link>
        </div>
      </div>
    </section>
  );
};
