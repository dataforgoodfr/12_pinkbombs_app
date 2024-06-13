import clsx from "clsx";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

const AboutSectionCTA = ({
  content,
  className = "",
  title,
  subtitle,
  id = "",
  mode,
  link,
  linkLabel,
}: {
  content?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  id?: string;
  mode?: "dark" | "light";
  link?: string;
  linkLabel?: string;
}) => {
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
        <Link
          className={clsx(
            "inline-flex items-center gap-2 mt-6 lg:mt-12 p-4 lg:text-xl text-red1 font-secondary uppercase rounded-xl tracking-widest border-2 border-red1 hover:bg-red1 hover:text-darkblue1 transition-colors ease-in-out duration-100",
            mode === "dark" ? "bg-darkblue1" : "bg-transparent",
          )}
          href={link}
        >
          <svg
            width="46"
            height="26"
            viewBox="0 0 46 26"
            className="fill-transparent hidden lg:inline-block -scale-75"
            aria-hidden="true"
          >
            <path
              d="M23 1C11.0632 1 4.02632 9.72727 2 14.0909C5.5 17.7273 14.6 25 23 25C31.4 25 40.5 17.7273 44 14.0909C41.9737 9.72727 34.9368 1 23 1Z"
              strokeWidth="2"
              className="stroke-current"
            />
            <path
              d="M30.8421 12.4546C30.8421 16.7099 27.3434 20.1818 23 20.1818C18.6566 20.1818 15.1579 16.7099 15.1579 12.4546C15.1579 8.1992 18.6566 4.72729 23 4.72729C27.3434 4.72729 30.8421 8.1992 30.8421 12.4546Z"
              strokeWidth="2"
              className="stroke-current"
            />
            <path
              d="M26.4211 12.4546C26.4211 14.3 24.9018 15.8182 23 15.8182C21.0982 15.8182 19.5789 14.3 19.5789 12.4546C19.5789 10.6092 21.0982 9.09094 23 9.09094C24.9018 9.09094 26.4211 10.6092 26.4211 12.4546Z"
              strokeWidth="2"
              className="stroke-current"
            />
          </svg>
          {linkLabel || t("edito.link")}
        </Link>
      ) : null}
    </div>
  );
};

export default AboutSectionCTA;
