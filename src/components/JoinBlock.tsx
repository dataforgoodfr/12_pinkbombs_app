import clsx from "clsx";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

const Chart = dynamic(() => import("@/components/Chart"), {
  ssr: false,
});

import MainLink from "@/components/links/MainLink";
import MetaChart from "@/components/MetaChart";

type JoinBlockProps = {
  className?: string;
  isAlternative?: boolean;
  headDark?: boolean;
};

const JoinBlock = ({
  className,
  headDark = true,
  isAlternative = false,
  ...rest
}: JoinBlockProps) => {
  const t = useTranslations("components");
  const baseText = isAlternative ? "alternatives" : "main";

  return (
    <div id="alternatives-block" className={className} {...rest}>
      <div
        className={clsx(
          "lg:bg-[url('/images/wave.svg')] bg-no-repeat bg-center bg-[length:3200px_272px]",
          headDark
            ? "text-darkblue1 lg:text-brown1 bg-brown1 lg:bg-darkblue1"
            : "text-red1",
        )}
      >
        <h2
          className={clsx(
            "h1",
            "p-6 lg:px-12 lg:pt-[130px] lg:pb-12 max-w-[1596px] mx-auto lg:bg-clip-text lg:text-transparent bg-no-repeat bg-center bg-[length:3200px_272px]",
            headDark
              ? "lg:bg-[url('/images/wave-text.svg')]"
              : "lg:bg-[url('/images/wave-text-light.svg')]",
          )}
          lang="en"
        >
          {t(`join.${baseText}.title`)}
        </h2>
      </div>
      <div className="px-6 lg:px-12 pb-6 lg:pb-24 text-darkblue1 bg-brown1">
        <div className="max-w-[1500px] mx-auto">
          <p className={clsx("h3", "pb-4 md:pb-8 max-w-3xl")}>
            {t(`join.${baseText}.intro`)}
          </p>
          <div
            className="pb-4 md:pb-16 max-w-3xl prose"
            dangerouslySetInnerHTML={{
              __html: t.raw(`join.${baseText}.content`),
            }}
          />
          {isAlternative && (
            <>
              <Chart id="alternatives" height={700} />
              <MetaChart
                hasBackground={false}
                data={[
                  {
                    type: "document",
                    link: t(`join.${baseText}.pdf`),
                    isBlank: true,
                  },
                  {
                    type: "methodology",
                    link: "/about#alternatives-section",
                  },
                  {
                    type: "data",
                    link: t(`join.${baseText}.data`),
                    artifact: t(`join.${baseText}.artifact`),
                  },
                  {
                    type: "image",
                    isBlank: true,
                    link: t(`join.${baseText}.image`),
                  },
                ]}
              />
            </>
          )}
        </div>
      </div>

      {!isAlternative && (
        <div className="p-6 md:p-12 xl:py-32 bg-yellow1 text-darkblue1">
          <div className="m-auto md:max-w-xl xl:max-w-4xl text-center font-secondary tracking-widest uppercase">
            <Image
              className="inline-block object-contain w-48 md:w-64 xl:w-[692px]"
              src="/images/eyes.svg"
              alt=""
              loading="lazy"
              width={692}
              height={134}
            />

            <p className="h3 mt-6 xl:mt-10">{t(`join.${baseText}.act`)}</p>

            <MainLink
              href="/to-act"
              mode="base"
              label={t(`join.${baseText}.link`)}
              className="mt-6 xl:mt-10"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default JoinBlock;
