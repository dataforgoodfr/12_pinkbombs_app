"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import Image from "next/image";
import ShareLink from "@/components/v2/links/shareLink";
import ArticlesBlock from "@/components/v2/ArticlesBlock";
import CalculatorBlock from "@/components/v2/CalculatorBlock";

interface TeamMember {
  name: string;
  role: string;
  pictureUrl: string;
  pictureAlt: string;
}

const About = () => {
  return (
    <>
      <IntroSection />
      <AmbitionSection />
      <ExplanationSection />
      <PresentationSection />
      <TeamSection />
      <PartnerSection />
      <StorySection />
      <ApproachAndMethodSection />
      <CalculatorBlock />
      <ArticlesBlock />
    </>
  );
};

export default About;

const IntroSection = () => {
  const t = useTranslations("site.about");

  return (
    <section className="bg-v2-pink text-v2-blue">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 py-12 lg:py-0 px-10 md:px-12">
        <div className="col-start-2 xl:col-start-3 flex flex-col gap-4 lg:pt-52 xl:pt-152 xl:-ml-[250px]">
          <h1 className="h1 text-pretty lg:max-w-[60%] xl:max-w-[80%]">{t("intro.title")}</h1>
          <p className="p-lead text-pretty xl:max-w-[80%]">{t("intro.caption")}</p>
        </div>
      </div>
      <Image
        loading="lazy"
        src="/site/images/about/surfing-fishes.svg"
        width={1537}
        height={596}
        alt={t("intro.imageAlt")}
        className="object-contain h-auto mx-auto md:-mt-48 lg:-mt-70 xl:w-[2000px]"
      />
    </section>
  );
};

const AmbitionSection = () => {
  const t = useTranslations("site.about");
  return (
    <section className="bg-white px-10 py-16 text-v2-blue">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:max-w-[1279px] mx-auto">
        <h3 className="h3 text-pretty">{t("ambition.origin")}</h3>
        <p className="text-pretty preserve-lines">
          {t.rich("ambition.paragraph", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>
    </section>
  );
};

const ExplanationSection = () => {
  const t = useTranslations("site.about");
  return (
    <section className="bg-v2-blue px-10 py-16">
      <h2 className="h2 text-pretty text-center text-v2-pink mb-8">{t("why.title")}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:max-w-[1279px] mx-auto">
        <div className="flex flex-col bg-v2-pink gap-8 p-6 lg:p-12 rounded-xl">
          <div className="flex flex-col items-start">
            <Image
              loading="lazy"
              src="/site/images/about/sinking-fish.svg"
              width={54}
              height={136}
              alt={t("why.situation.imageAlt")}
              className="object-contain"
            />
            <h2 className="h2 text-pretty text-v2-red">{t("why.situation.title")}</h2>
          </div>
          <p className="text-pretty preserve-lines">
            {t.rich("why.situation.paragraph", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>
        <div className="flex flex-col bg-v2-green gap-8 p-6 lg:p-12 rounded-xl">
          <div className="flex flex-col items-start gap-2">
            <Image
              loading="lazy"
              src="/site/images/about/moving-on-fish.svg"
              width={54}
              height={136}
              alt={t("why.reaction.imageAlt")}
              className="object-contain"
            />
            <h2 className="h2 text-pretty text-v2-blue">{t("why.reaction.title")}</h2>
          </div>
          <p className="text-pretty preserve-lines">
            {t.rich("why.reaction.paragraph", {
              strong: (chunks) => <strong>{chunks}</strong>,
              ul: (chunks) => <ul>{chunks}</ul>,
              li: (chunks) => <li className="list-disc ml-5">{chunks}</li>,
            })}
          </p>
        </div>
      </div>

    </section>
  );
};

const PresentationSection = () => {
  const t = useTranslations("site.about");
  return (
    <section className="bg-v2-white text-v2-blue px-10 pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:max-w-[1279px] mx-auto">
        <div className="flex flex-col gap-8">
          <h2 className="h2 text-pretty">{t("seastemik.title")}</h2>
          <p className="p-body preserve-lines">{t("seastemik.paragraph")}</p>
          <ShareLink href="https://seastemik.org/"  name="Seastemik" customName={t("seastemik.cta")} iconFillColor="fill-v2-blue" className="font-secondary font-bold text-md uppercase tracking-wide" />
        </div>
        <div className="flex flex-col gap-8">
          <h2 className="h2 text-pretty">{t("dataforgood.title")}</h2>
          <p className="p-body preserve-lines">{t("dataforgood.paragraph")}</p>
          <ShareLink href="https://dataforgood.org/"  name="Data for Good" customName={t("dataforgood.cta")} iconFillColor="fill-v2-blue" className="font-secondary font-bold text-md uppercase tracking-wide" />
        </div>
      </div>

    </section>
  );
};

const TeamSection = () => {
  const t = useTranslations("site.about");
  const teamMembers = t.raw("teamSection.members") as TeamMember[];
  return (
    <section className="bg-v2-white text-v2-blue pt-14 px-10 lg:px-0 lg:max-w-[1279px] mx-auto">
      <h2 className="h2 text-pretty mb-8">{t("teamSection.title")}</h2>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex flex-row flex-wrap gap-8">
          {
            teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center gap-2 max-w-[132px]">
                <Image
                  loading="lazy"
                  src={member.pictureUrl}
                  width={131}
                  height={131}
                  alt={member.pictureAlt}
                  className="object-contain rounded-full"
                />
                <div className="flex justify-center flex-col h-full items-center  text-center">
                  <h3 className="p-lead">{member.name}</h3>
                  <p className="p-caption preserve-lines">{member.role}</p>
                </div>
              </div>
            ))
          }
        </div>
        <div className="flex flex-col items-center gap-8 lg:max-w-[911px]">
          <p className="p-lead">{t("teamSection.greetings")}</p>
        </div>
      </div>
    </section>
  );
};

const PartnerSection = () => {
  const t = useTranslations("site.about");
  return (
    <section className="bg-v2-white text-v2-blue pt-14 px-10 lg:px-0 lg:max-w-[1279px] mx-auto">
      <h2 className="h2 text-pretty mb-8">{t("partner.title")}</h2>
      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center border border12 border-v2-blue md:border-none lg:border-solid lg:border-v2-blue rounded-xl">
          <Image
            loading="lazy"
            src="/site/images/about/kresk-4-oceans.jpg"
            width={297}
            height={178}
            alt={t("partner.imageAlt")}
            className="rounded-t-lg md:rounded-l-lg md:rounded lg:rounded-tr-none object-cover"
          />
          <p className="py-6 md:py-0 px-4 p-lead preserve-lines">{t("partner.paragraph")}</p>
        </div>
      </div>
    </section>
  );
};

const StorySection = () => {
  const t = useTranslations("site.about");
  const logoItems = [
    {
      imgSrc: "/site/images/about/media-logos/tf1.png",
      alt: t("mediaLogosAlt.tf1"),
      width: 102,
      height: 37,
    },
    {
      imgSrc: "/site/images/about/media-logos/france-info.png",
      alt: t("mediaLogosAlt.franceInfo"),
      width: 183,
      height: 28,
    },
    {
      imgSrc: "/site/images/about/media-logos/la-croix.png",
      alt: t("mediaLogosAlt.laCroix"),
      width: 148,
      height: 28,
    },
    {
      imgSrc: "/site/images/about/media-logos/radio-france.png",
      alt: t("mediaLogosAlt.radioFrance"),
      width: 186,
      height: 38,
    },
    {
      imgSrc: "/site/images/about/media-logos/le-bon-pote.png",
      alt: t("mediaLogosAlt.leBonPote"),
      width: 78,
      height: 78,
    },
    {
      imgSrc: "/site/images/about/media-logos/brut.png",
      alt: t("mediaLogosAlt.brut"),
      width: 89,
      height: 31,
    },
    {
      imgSrc: "/site/images/about/media-logos/france-inter.png",
      alt: t("mediaLogosAlt.franceInter"),
      width: 61,
      height: 62,
    },
    {
      imgSrc: "/site/images/about/media-logos/le-monde.png",
      alt: t("mediaLogosAlt.leMonde"),
      width: 134,
      height: 34,
    }
  ] 
  return (
    <section className="bg-v2-white py-14 px-10 lg:px-0 lg:max-w-[1279px] mx-auto">
      <h2 className="h2 text-v2-blue text-pretty mb-8">{t("story.title")}</h2>
      <div className="flex flex-col px-4 lg:px-10 items-center gap-10 lg:flex-row bg-v2-blue rounded-xl">
        <p className="py-6 px-4 preserve-lines text-white ">
            {t.rich("story.paragraph", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <Image
          loading="lazy"
          src="/site/images/about/phone-medias.png"
          width={494}
          height={474}
          alt={t("story.imageAlt")}
          className="rounded-t-lg mx-auto"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:flex flex-row gap-8 mt-10 items-center justify-center">
        {
          logoItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 max-w-[132px]">
              <Image
                loading="lazy"
                src={item.imgSrc}
                width={item.width}
                height={item.height}
                alt={item.alt}
                className="object-contain"
              />
            </div>
          ))
        }
      </div>
    </section>
  );
};

const ApproachAndMethodSection = () => {
  const t = useTranslations("site.about");
  const valueItems = t.raw("method.values.items") as string[];
  const stepItems = t.raw("method.steps.items") as string[];
  return (
    <section className="bg-v2-white text-v2-blue">
      <div className="pt-14 px-10 lg:px-0 lg:max-w-[642px] mx-auto">
        <h2 className="h2 text-v2-blue text-pretty mb-8">{t("method.title")}</h2>
        <p className="p-lead">{t("method.caption")}</p>
        <div className="flex flex-col gap-8 my-8">
          <h4 className="h4">{t("method.values.title")}</h4>
          <div className="flex flex-col gap-4">
            {
              valueItems.map((_, index) => (
                <p key={index} className="preserve-lines">{t.rich(`method.values.items.${index}`, {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}</p>
              ))
            }
          </div>
          <h4 className="h4">{t("method.steps.title")}</h4>
          <div className="flex flex-col gap-4">
            {
              stepItems.map((_, index) => (
                <p key={index} className="preserve-lines">{t.rich(`method.steps.items.${index}`, {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}</p>
              ))
            }
          </div>
          <p className="p-lead">{t("method.missingInfo")}</p>
          <ShareLink href="/" name="Download" customName={t("method.downloadCta")} iconFillColor="fill-v2-pink" className="font-secondary font-bold text-md text-v2-pink uppercase tracking-wide max-w-[95%]" />
        </div>
        <h2 className="h2 mt-20">{t("contact.title")}</h2>
        <div className="flex flex-col gap-8 mt-8 mb-20">
          <p className="p-lead">{t("contact.paragraph")}</p>
          <ShareLink href="mailto:info@seastemik.org" name="Seastemik Email" customName="info@seastemik.org" iconFillColor="fill-v2-pink" className="font-secondary font-bold text-md text-v2-pink uppercase tracking-wide" />
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