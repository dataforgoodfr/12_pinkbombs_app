import clsx from "clsx";
import Link from "next/link";
import React from "react";

type MainLinkProps = {
  className?: string;
  href: string;
  label: string;
  mode?: "dark" | "base" | "light";
  isBlank?: boolean;
  hasIcon?: boolean;
};

const MainLink = ({
  className,
  href,
  label,
  mode = "dark",
  isBlank = false,
  hasIcon = false,
  ...rest
}: MainLinkProps) => {
  if (!href || !label) {
    return <></>;
  }

  return (
    <Link
      className={clsx(
        "group inline-flex items-center gap-2 p-4 lg:text-xl text-red1 font-secondary uppercase !no-underline rounded-xl tracking-widest border-2 border-red1 transition-colors ease-in-out duration-100",
        mode === "dark" &&
          "bg-darkblue1 text-red2 hover:bg-red2 hover:text-darkblue1",
        mode === "base" && "bg-red1 text-white hover:bg-darkblue1",
        mode === "light" && "text-red1 hover:bg-red2 hover:text-darkblue1",
        className,
      )}
      href={href}
      rel={isBlank ? "noopener noreferrer" : undefined}
      target={isBlank ? "_blank" : undefined}
      {...rest}
    >
      {hasIcon && (
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
      )}
      {label}
      {isBlank && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          className={clsx(
            "inline-block ml-2 align-baseline",
            mode === "base"
              ? "fill-white"
              : "fill-red1 group-hover:fill-darkblue1",
          )}
          viewBox="0 -960 960 960"
          width="16"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
        </svg>
      )}
    </Link>
  );
};

export default MainLink;
