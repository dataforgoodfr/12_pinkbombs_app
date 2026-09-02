import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Button = ({
  className,
  content,
  type = "regular",
  href = "#",
  textColor = "text-v2-pink",
  borderColor = "border-v2-blue",
  backgroundColor = "bg-v2-blue",
}: {
  textColor?: "text-v2-blue" | "text-v2-pink";
  borderColor?:
    | "border-white"
    | "border-black"
    | "border-v2-blue"
    | "border-v2-pink";
  backgroundColor?: "bg-white" | "bg-black" | "bg-v2-blue" | "bg-v2-pink";
  className?: string;
  href?: string;
  content: JSX.Element | string;
  type?: "regular" | "small";
}) => {
  if (!content) {
    return <></>;
  }
  return (
    <Link
      className={clsx(
        "inline-flex cta border-2 rounded-xl pointer-events-auto hover:scale-105",
        borderColor,
        className,
        textColor,
        backgroundColor,
        type === "small" && "px-4 py-2 text-sm lg:text-base w-fit",
        type === "regular" && "px-8 py-3 gap-5",
      )}
      href={href}
    >
      {type === "regular" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.9849 10.6445L19.5327 12L17.9849 13.3545L8.38525 21.7539L6.01416 19.0449L14.0659 11.999L6.01416 4.9541L8.38525 2.24512L17.9849 10.6445Z"
            fill="#E82D04"
          />
        </svg>
      )}
      {content}
    </Link>
  );
};
export default Button;
