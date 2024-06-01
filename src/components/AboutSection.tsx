import { useTranslations } from "next-intl";
import React from "react";

const AboutSection = ({
  content,
  className = "",
  title,
  id = ""
}: {
  content: string;
  className?: string;
  title: string;
  id?: string;
}) => {
  const t = useTranslations();
  if (!content) return <></>;

  return (
    <div className={className}>
      <div id={id} dangerouslySetInnerHTML={{ __html: t.raw(title) }} className="h3 p-6 md:p-12 max-w-[1596px] mx-auto prose"></div>
      <div dangerouslySetInnerHTML={{ __html: t.raw(content) }} className="p-6 md:p-12 max-w-[1596px] mx-auto prose"></div>
    </div>
  );
};

export default AboutSection;
