import { useTranslations } from "next-intl";
import React from "react";

const AboutSection = ({
  content,
  classname = "p",
}: {
  content: string;
  classname?: string;
}) => {
  const t = useTranslations();
  return (
    <div className="flex justify-center flex-col mx-6 md:mx-12 xl:mx-[60px]">
      <p
        dangerouslySetInnerHTML={{ __html: t.raw(content) }}
        className={classname}
      ></p>
    </div>
  );
};

export default AboutSection;
