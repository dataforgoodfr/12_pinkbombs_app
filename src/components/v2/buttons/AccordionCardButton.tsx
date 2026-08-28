import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const AccordionCardButton = ({
  className,
  content,
  type = "internalRedirect",
  href = "#",
}: {
  className?: string;
  href?: string;
  content: JSX.Element | string;
  type:
    | "internalArticle"
    | "externalArticle"
    | "internalRedirect"
    | "externalRedirect"
    | "download";
}) => {
  if (!content) {
    return <></>;
  }
  return (
    <Link
      className={clsx(
        "flex items-center justify-between py-2 px-4 p-lead border-2 border-v2-pink rounded-xl hover:scale-105 text-v2-blue",
        className,
        type === "externalArticle" || type === "internalArticle"
          ? "bg-white"
          : "bg-v2-pink",
      )}
      href={href}
    >
      {content}
      {(type === "internalRedirect" || type === "internalArticle") && (
        <ChevronRight className="h-8 w-8 text-v2-red" />
      )}
      {(type === "externalArticle" || type === "externalRedirect") && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.41857 7.27471H4.88704V19.1129H16.7252V15.5814H19.2124V21.6H2.3999V4.78758H8.41857V7.27471ZM21.5999 11.6029H19.1128V6.64564L12.8779 12.8805L11.1194 11.122L17.3543 4.88716H12.397V2.40002H21.5999V11.6029Z"
            fill="#E82D04"
          />
        </svg>
      )}
      {type === "download" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.7999 14.4V20.4H19.1999V14.4H21.5999V22.8H2.3999V14.4H4.7999Z"
            fill="#E82D04"
          />
          <path
            d="M13.0804 0.80011V16.8009H10.9194V0.80011H13.0804Z"
            fill="#E82D04"
          />
          <path
            d="M17.564 12.7641L11.9999 18.3281L6.43584 12.7641L7.96397 11.236L11.9999 15.2719L16.0358 11.236L17.564 12.7641Z"
            fill="#E82D04"
          />
        </svg>
      )}
    </Link>
  );
};
export default AccordionCardButton;
