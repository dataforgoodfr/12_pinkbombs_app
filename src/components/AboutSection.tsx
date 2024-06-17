import clsx from "clsx";
import { useTranslations } from "next-intl";
import React from "react";

import MainLink from "@/components/links/MainLink";

type AboutSectionProps = {
  content?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  id?: string;
  link?: string;
  linkLabel?: string;
};

const AboutSection = ({
  content,
  className = "",
  title,
  subtitle,
  id = "",
  link,
  linkLabel,
}: AboutSectionProps) => {
  const t = useTranslations("components");

  if (!content && !title && !subtitle) return <></>;

  return (
    <div
      id={id}
      className={clsx(className, "px-6 md:px-12 max-w-[1000px] mx-auto prose")}
    >
      {title && <h3>{title}</h3>}
      {subtitle && <h4>{subtitle}</h4>}
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}

      {link ? (
        <MainLink
          href={link}
          label={linkLabel || t("edito.link")}
          isBlank
          hasIcon
          mode="light"
        />
      ) : null}
    </div>
  );
};

export default AboutSection;
