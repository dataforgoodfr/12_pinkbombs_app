import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import MainLink from "@/components/links/MainLink";

type EditoProps = {
  className?: string;
  title: string;
  titleLevel?: "h1" | "h2" | "h3";
  mode?: "dark" | "light";
  image?: {
    src: string;
    alt?: string;
    caption?: string;
  };
  content: string;
  ctas?: {
    target: string;
    label?: string;
    isBlank?: boolean;
    hasIcon?: boolean;
  }[];
  contentPosition?: "left" | "right";
};

const Edito = ({
  className,
  title,
  titleLevel = "h1",
  image,
  content,
  mode = "dark",
  ctas,
  contentPosition = "left",
}: EditoProps) => {
  const t = useTranslations("components");

  return (
    <div
      className={clsx(
        "p-6 pb-14 lg:p-12",
        className,
        mode === "dark" ? "text-white bg-darkblue1" : "",
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-14 2xl:gap-32 max-w-[1500px] mx-auto">
        <div className="flex-1">
          <h2 className={clsx(titleLevel, "text-red1")}>{title}</h2>
          <p
            className="mt-3 lg:mt-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {ctas?.length ? (
            <div className="flex flex-wrap gap-4 mt-4 lg:mt-8">
              {ctas.map((cta, key) => (
                <MainLink
                  label={cta.label || t("edito.link")}
                  href={cta.target}
                  key={`edito-cta-${key}`}
                  mode="base"
                  isBlank={cta.isBlank}
                  hasIcon={cta.hasIcon}
                />
              ))}
            </div>
          ) : null}
        </div>

        {image && image.src ? (
          <figure
            className={clsx(
              contentPosition === "right" ? "md:-order-1" : "",
              "w-full max-w-[600px] md:w-1/2 xl:w-[600px]",
            )}
          >
            <picture
              className={clsx(
                contentPosition === "right"
                  ? "shadow-[-10px_10px_0_0_#F34620]"
                  : "shadow-[10px_10px_0_0_#F34620]",
                "block aspect-square",
              )}
            >
              <Image
                loading="lazy"
                src={image.src}
                width={600}
                height={600}
                alt=""
                className="w-full h-full object-cover"
              />
            </picture>
            {image.caption && (
              <figcaption className="p-caption mt-4 lg:mt-7">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ) : null}
      </div>
    </div>
  );
};
export default Edito;
