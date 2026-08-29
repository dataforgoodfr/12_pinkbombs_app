"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import ExplorationBlock from "@/components/v2/ExplorationBlock";
import CalculatorBlock from "@/components/v2/CalculatorBlock";
import type { MenuCardProps } from "@/components/v2/cards/MenuCard";
import MenuCard from "@/components/v2/cards/MenuCard";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ExplodeSection />
      <ImpactSection />
      <MenuSection />
      <AdditionSection />
      <CalculatorBlock />
      <ExplorationBlock />
    </>
  );
};

export default HomePage;

const HeroSection = () => {
  const t = useTranslations("site.homepage");
  return (
    <section className="flex lg:mt-26 py-20 lg:pt-40 px-10 min-h-[300px] lg:h-screen text-v2-pink bg-v2-blue">
      <div className="flex flex-col gap-24 lg:gap-8 lg:grid grid-rows-[1fr, auto, 1fr] w-full max-w-[1596px] mx-auto">
        <Image
          loading="lazy"
          src="/site/images/homepage/fish-plate.svg"
          width={571}
          height={425}
          alt={t("hero.imageAlt")}
          className="object-contain h-auto mx-auto"
        />
        <div className="row-start-3 items-left flex gap-2 lg:max-w-[48%]">
          <p
            className={clsx(
              "h1",
              "lg:max-w-[1500px] mx-auto w-full text-pretty",
            )}
          >
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
    <section className="relative bg-v2-pink">
      <div className="bg-[url(/site/images/homepage/divider-explode-section.svg)] bg-center bg-repeat w-full h-[49px]" />
      <div className="flex flex-col gap-20 lg:gap-0 pt-20 lg:pt-0 lg:flex-col-reverse text-black lg:min-h-[760px] max-w-[1596px] mx-auto">
        <div className="absolute px-10 lg:bottom-6 flex row-start-3 items-left flex gap-2 lg:max-w-[60%]">
          <p className="h1 text-pretty">{t("bomb.title")}</p>
        </div>
        <Image
          loading="lazy"
          src="/site/images/homepage/fish-bomb.svg"
          width={1130}
          height={692}
          alt={t("bomb.imageAlt")}
          className="pt-72 lg:pt-24 object-contain mx-auto h-auto"
        />
      </div>
    </section>
  );
};

const ImpactSection = () => {
  const t = useTranslations("site.homepage");
  return (
    <section className="relative flex flex-col px-10 lg:px-16 text-black bg-v2-blue mx-auto">
      <div className="max-w-[1512px] mx-auto">
        <div className="bg-[url(/site/images/homepage/divider-impact-section.svg)] bg-center bg-repeat w-full h-[48px]" />
        <div className="flex flex-col py-20 space-between gap-20 lg:gap-12">
          <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-0 items-center justify-between max-w-[1512px]">
            <Image
              loading="lazy"
              src="/site/images/homepage/eiffel-towers.svg"
              width={611}
              height={179}
              alt={t("impact.imageAltTitle")}
              className="block flex-1 object-contain lg:max-w-[611px] mx-auto h-auto"
            />
            <div className="flex flex-col flex-1 text-v2-pink lg:max-w-[50%]">
              <p className="h2">{t("impact.title")}</p>
              <p className="h2 text-v2-red">{t("impact.titleHighlight")}</p>
              <p className="p-lead pt-2">{t("impact.impact")}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-0 items-center justify-between">
            <Image
              loading="lazy"
              src="/site/images/homepage/salmons.svg"
              width={646}
              height={59}
              alt={t("impact.imageAltDescription")}
              className="object-contain flex-1 lg:max-w-[646px] mx-auto"
            />
            <div className="flex flex-col flex-1 text-v2-pink lg:max-w-[48%]">
              <p className="h2 text-pretty">{t("impact.title2")}</p>
              <p className="h2 text-v2-red">{t("impact.title2Highlight")}</p>
              <p className="p-lead pt-2">{t("impact.description")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuSection = () => {
  const t = useTranslations("site.homepage");
  const menuCardItems = t.raw("menu.menuCards") as MenuCardProps[];
  return (
    <section className="relative flex flex-col bg-white mx-auto ">
      <div className="bg-[url(/site/images/homepage/divider-menu-section.svg)] bg-center bg-repeat w-full h-[48px]" />
      <div className="max-w-[1512px] mx-auto">
        <div className="flex flex-col px-4 py-20 lg:px-0 space-between gap-6 lg:gap-12 max-w-[658px] mx-auto">
          <p className="h2 text-center mt-4 text-pretty">
            <span className="text-v2-red">{t("menu.title.part1")} </span>
            <span className="text-v2-blue">{t("menu.title.part2")} </span>
            <span className="text-v2-red">{t("menu.title.part3")}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-2 gap-4 px-6 lg:px-32 pb-20">
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
          <p className="h3 italic">{t("addition.results.intro")}</p>
          <div className="lg:grid grid-rows-4">
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/salmons.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item1.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h2">
                  {t("addition.results.resultItems.item1.title")}
                </span>{" "}
                <span className="p-lead">
                  {t("addition.results.resultItems.item1.description")}
                </span>
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
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/cereal.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item2.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h2">
                  {t("addition.results.resultItems.item2.title")}
                </span>{" "}
                <span className="p-lead">
                  {t("addition.results.resultItems.item2.description")}
                </span>
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
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/carbon.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item3.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h2">
                  {t("addition.results.resultItems.item3.title")}
                </span>{" "}
                <span className="p-lead">
                  {t("addition.results.resultItems.item3.description")}
                </span>
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
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2">
              <Image
                loading="lazy"
                src="/site/images/components/farmed-fishes.svg"
                width={81}
                height={81}
                alt={t("addition.results.resultItems.item4.imageAlt")}
                className="mr-4"
              />
              <div>
                <span className="h2">
                  {t("addition.results.resultItems.item4.title")}
                </span>{" "}
                <span className="p-lead">
                  {t("addition.results.resultItems.item4.description")}
                </span>
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
          <p className="h3 italic text-pretty">{t("addition.addOns.intro")}</p>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2 border-bottom">
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
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2 border-bottom">
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
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2 border-bottom">
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
            <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2 border-bottom">
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
      <Image
        loading="lazy"
        src="/site/images/homepage/calculator-divider.svg"
        width={1512}
        height={53}
        alt="divider"
        className="absolute bottom-0 object-contain xl:w-[2000px] mx-auto"
      />
    </section>
  );
};
