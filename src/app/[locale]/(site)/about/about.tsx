"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import "@/lib/env";

import CalculatorBlock from "@/components/v2/CalculatorBlock";
import ExplorationBlock from "@/components/v2/ExplorationBlock";

import { Link } from "@/navigation";

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
      <ExplorationBlock />
    </>
  );
};

export default About;

const IntroSection = () => {
  const t = useTranslations("site.about");

  return (
    <section className="bg-v2-pink text-v2-blue">
      <div className="mx-auto grid max-w-[1596px] grid-cols-1 items-center gap-12 px-8 py-10 lg:min-h-[400px] lg:grid-cols-2 lg:gap-10 lg:px-32">
        <div className="flex min-w-0 flex-col gap-4 lg:col-start-2 lg:row-start-1 2xl:mt-[200px]">
          <h1 className="h1 text-pretty">{t("intro.title")}</h1>
          <p className="p-lead text-pretty">{t("intro.caption")}</p>
        </div>
      </div>
      <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:-ml-32 2xl:ml-0">
          <Image
            loading="lazy"
            src="/site/images/about/surfing-fishes.svg"
            width={1512}
            height={431}
            alt={t("intro.imageAlt")}
            className="relative lg:-mt-[260px] xl:-mt-[360px] 2xl:-mt-[420px] h-auto w-full object-cover"
          />
        </div>
    </section>
  );
};

const AmbitionSection = () => {
  const t = useTranslations("site.about");
  return (
    <section className="bg-white text-v2-blue">
      <div className="mx-auto grid max-w-[1596px] grid-cols-1 gap-8 px-8 py-12 lg:grid-cols-2 lg:px-32 2xl:py-24">
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
    <section className="bg-v2-blue">
      <div className="mx-auto max-w-[1596px] px-8 py-12 lg:px-32 2xl:py-24">
        <h2 className="h2 text-pretty text-center text-v2-pink mb-8">
          {t("why.title")}
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col justify-center bg-v2-pink gap-8 p-6 xl:p-12 rounded-xl">
            <div className="flex flex-col items-start">
              <Image
                loading="lazy"
                src="/site/images/about/sinking-fish.svg"
                width={98}
                height={90}
                alt={t("why.situation.imageAlt")}
                className="object-contain"
              />
              <h2 className="h2 text-pretty text-v2-red">
                {t("why.situation.title")}
              </h2>
            </div>
            <p className="text-pretty preserve-lines">
              {t.rich("why.situation.paragraph", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
          <div className="flex min-w-0 flex-col justify-center bg-v2-green gap-8 p-6 xl:p-12 rounded-xl">
            <div className="flex flex-col items-start gap-2">
              <Image
                loading="lazy"
                src="/site/images/about/moving-on-fish.svg"
                width={100}
                height={45}
                alt={t("why.reaction.imageAlt")}
                className="object-contain"
              />
              <h2 className="h2 text-pretty text-v2-blue">
                {t("why.reaction.title")}
              </h2>
            </div>
            <div className="text-pretty preserve-lines">
              {t.rich("why.reaction.paragraph", {
                strong: (chunks) => <strong>{chunks}</strong>,
                ul: (chunks) => <ul>{chunks}</ul>,
                li: (chunks) => <li className="list-disc ml-5">{chunks}</li>,
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PresentationSection = () => {
  const t = useTranslations("site.about");
  return (
    <section className="bg-white text-v2-blue">
      <div className="mx-auto grid max-w-[1596px] grid-cols-1 gap-12 px-8 py-12 lg:grid-cols-2 lg:px-32 2xl:py-24">
        <div className="flex min-w-0 flex-col gap-8">
          <Image
            loading="lazy"
            src="/site/images/seastemik-logo.svg"
            width={768}
            height={166}
            alt="Logo Seastemik"
            className="object-contain w-[40%]"
          />
          <h2 className="sr-only">{t("seastemik.title")}</h2>
          <p className="p-body preserve-lines">
            {t.rich("seastemik.paragraph", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <a
            href="https://seastemik.org/"
            target="_blank"
            className="group cta font-primary font-black text-sm uppercase tracking-wide hover:text-v2-magenta"
          >
            {t("seastemik.cta")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              className="inline-block ml-2 align-middle fill-v2-blue group-hover:fill-v2-magenta"
              viewBox="0 -960 960 960"
              width="16"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
            </svg>
          </a>
        </div>
        <div className="flex min-w-0 flex-col gap-8">
          <Image
            loading="lazy"
            src="/site/images/dataforgood_logo.svg"
            width={768}
            height={166}
            alt="Logo Data for Good"
            className="object-contain w-[40%]"
          />
          <h2 className="sr-only">{t("dataforgood.title")}</h2>
          <p className="p-body preserve-lines">{t("dataforgood.paragraph")}</p>
          <a
            href="https://dataforgood.fr/"
            target="_blank"
            className="group cta font-primary font-black text-sm uppercase tracking-wide hover:text-v2-magenta"
          >
            {t("dataforgood.cta")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              className="inline-block ml-2 align-middle fill-v2-blue group-hover:fill-v2-magenta"
              viewBox="0 -960 960 960"
              width="16"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const t = useTranslations("site.about");
  const teamMembers = t.raw("teamSection.members") as TeamMember[];
  return (
    <section className="bg-white text-v2-blue">
      <div className="mx-auto flex max-w-[1596px] flex-col gap-10 px-8 py-12 lg:px-32 2xl:py-24">
        <h2 className="h2 text-pretty">{t("teamSection.title")}</h2>
        <div className="grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-6 xl:gap-x-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex min-w-0 w-full max-w-[180px] flex-col items-center gap-2 break-words"
            >
              <Image
                loading="lazy"
                src={member.pictureUrl}
                width={146}
                height={146}
                alt={member.pictureAlt}
                className="h-auto w-full max-w-[146px] object-contain rounded-full"
              />
              <div className="flex w-full justify-center flex-col h-full items-center text-center">
                <h3 className="p-lead">{member.name}</h3>
                <p className="p-caption preserve-lines">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto flex w-full max-w-[911px] flex-col gap-8">
          <p className="p-body">
            {t.rich("teamSection.greetings", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="p-body">
            {t.rich("teamSection.greetingsv1", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

const PartnerSection = () => {
  const t = useTranslations("site.about");
  return (
    <section className="bg-white text-v2-blue">
      <div className="mx-auto flex max-w-[1596px] flex-col gap-10 px-8 py-12 lg:px-32 2xl:py-24">
        <h2 className="h2 text-pretty">{t("partner.title")}</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center border border12 border-v2-blue md:border-none lg:border-solid lg:border-v2-blue rounded-xl">
          <Image
            loading="lazy"
            src="/site/images/about/kresk-4-oceans.png"
            width={297}
            height={178}
            alt={t("partner.imageAlt")}
            className="h-auto w-full md:w-2/5 md:max-w-[297px] md:shrink-0 rounded-t-lg md:rounded-l-lg md:rounded lg:rounded-tr-none object-cover"
          />
          <p className="min-w-0 px-4 py-6 p-lead preserve-lines">
            {t("partner.paragraph")}
          </p>
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
    },
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1596px] px-8 py-12 lg:px-32 2xl:py-24">
        <h2 className="h2 text-v2-blue text-pretty mb-8">{t("story.title")}</h2>
        <div className="bg-v2-blue flex flex-col px-4 lg:px-10 items-center gap-10 lg:flex-row rounded-xl">
          <p className="min-w-0 py-6 px-4 preserve-lines text-white">
            <span>
              {t.rich("story.paragraphFirstPart", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </span>{" "}
            <span>
              <a
                href={t("story.paragraphUrl")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:font-semibold"
              >
                {t("story.paragraphLinkText")}
              </a>
              .{" "}
            </span>
            <span>
              {t.rich("story.paragraphLastPart", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </span>
          </p>
          <Image
            loading="lazy"
            src="/site/images/about/phone-medias.png"
            width={494}
            height={474}
            alt={t("story.imageAlt")}
            className="mx-auto h-auto w-full max-w-[494px] rounded-t-lg lg:w-1/2 lg:shrink-0"
          />
        </div>
        <div className="grid grid-cols-2 justify-items-center gap-8 mt-10 items-center md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center">
          {logoItems.map((item, index) => (
            <div
              key={index}
              className="flex min-w-0 flex-col items-center gap-2 max-w-[132px]"
            >
              <Image
                loading="lazy"
                src={item.imgSrc}
                width={item.width}
                height={item.height}
                alt={item.alt}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApproachAndMethodSection = () => {
  const t = useTranslations("site.about");
  const valueItems = t.raw("method.values.items") as string[];
  const stepItems = t.raw("method.steps.items") as string[];
  return (
    <section id={t("method.sectionId")} className="bg-white text-v2-blue">
      <div className="mx-auto max-w-[1596px] px-8 py-12 lg:px-32 2xl:py-24">
        <div className="mx-auto max-w-[642px]">
          <h2 className="h2 text-v2-blue text-pretty mb-8">
            {t("method.title")}
          </h2>
          <p className="p-lead">{t("method.caption")}</p>
          <div className="flex flex-col gap-8 my-8">
            <h4 className="h4">{t("method.values.title")}</h4>
            <div className="flex flex-col gap-4">
              {valueItems.map((_, index) => (
                <p key={index} className="preserve-lines">
                  {t.rich(`method.values.items.${index}`, {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              ))}
            </div>
            <h4 className="h4">{t("method.steps.title")}</h4>
            <div className="flex flex-col gap-4">
              {stepItems.map((_, index) => (
                <p key={index} className="preserve-lines">
                  {t.rich(`method.steps.items.${index}`, {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              ))}
            </div>
            <p className="p-lead">{t("method.missingInfo")}</p>
            <Link
              href="/"
              className="flex gap-2 cta font-primary font-black text-sm uppercase tracking-wide hover:text-v2-magenta"
            >
              {t("method.downloadCta")}
              <svg
                className="inline-block"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 8.99994V12.7499H12V8.99994H13.5V14.2499H1.5V8.99994H3Z"
                  fill="#13176E"
                />
                <path
                  d="M8.17529 0.5V10.5005H6.82471V0.5H8.17529Z"
                  fill="#13176E"
                />
                <path
                  d="M10.9775 7.97748L7.5 11.455L4.02246 7.97748L4.97754 7.0224L7.5 9.54486L10.0225 7.0224L10.9775 7.97748Z"
                  fill="#13176E"
                />
              </svg>
            </Link>
          </div>
          <h2 className="h2 mt-12">{t("contact.title")}</h2>
          <div className="flex flex-col gap-8 mt-8">
            <p className="p-body">
              {t.rich("contact.paragraph", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <a
              href="mailto:info@seastemik.org"
              className="group cta font-primary font-black text-sm uppercase tracking-wide hover:text-v2-magenta"
            >
              info@seastemik.org
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                className="inline-block ml-2 align-middle fill-v2-blue group-hover:fill-v2-magenta"
                viewBox="0 -960 960 960"
                width="16"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <Image
        loading="lazy"
        src="/site/images/about/calculator-block-divider.svg"
        width={1512}
        height={53}
        alt="Divider"
        className="block w-full h-auto"
      />
    </section>
  );
};
