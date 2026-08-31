import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";

import AccordionCardButton from "@/components/v2/buttons/AccordionCardButton";

export interface RecommendationProps {
  title: string;
  actions: ActionProps[];
}

interface ActionProps {
  cta: string;
  url?: string;
  type:
    | "internalRedirect"
    | "externalRedirect"
    | "internalArticle"
    | "externalArticle"
    | "download";
}

export interface AccordionCardProps {
  recommendation: RecommendationProps;
  onClick: () => void;
  isActive: boolean;
  index: number;
  type: "individual" | "company";
}

const AccordionCard = ({
  recommendation: { title, actions },
  onClick,
  index,
  isActive,
  type,
}: AccordionCardProps) => {
  const t = useTranslations("site.toAct");
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !accordionRef.current) return;
    if (index === 0) return;

    // Wait for the accordion content to be rendered
    requestAnimationFrame(() => {
      accordionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [isActive, index]);

  return (
    <div
      ref={accordionRef}
      className="mb-3 rounded-2xl border border-v2-magenta transition-colors"
    >
      <button
        onClick={onClick}
        type="button"
        aria-expanded={isActive}
        className={`flex w-full items-center justify-between p-8 text-left rounded-2xl focus:outline-hidden ${isActive ? "" : "hover:bg-v2-magenta/20"}`}
      >
        <div className="flex items-start md:items-center gap-4 lg:gap-10">
          <span className="block text-6xl text-v2-magenta font-secondary font-extrabold">
            {index + 1}
          </span>
          <h3 className="h3 text-pretty">{title}</h3>
        </div>
        <ChevronDown
          className={`shrink-0 w-8 h-8 lg:w-10 lg:h-10 transition-transform ${isActive ? "rotate-180 transform" : ""}`}
        />
      </button>
      <div
        className={`${
          isActive ? "grid-rows-[1fr] p-8 pt-2 lg:p-8" : "hidden"
        } grid transition-all duration-200`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div className="flex flex-col gap-4">
            <h5 className="h5 uppercase">{t("howToAct")}</h5>
            <p className="overflow-hidden p-body preserve-lines">
              {t.rich(`${type}Section.recommendations.${index}.description`, {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="h5 uppercase">{t("iAct")}</h5>
            {actions.map((action, index) => (
              <AccordionCardButton
                key={index}
                content={action.cta}
                href={action.url}
                type={action.type}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccordionCard;
