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
  borderColor?: "border-white" | "border-black" | "border-v2-blue" | "border-v2-pink";
  backgroundColor?: "bg-white" | "bg-black" | "bg-v2-blue";
  className?: string;
  href?: string;
  content: JSX.Element | string;
  type: "regular" | "small";
}) => {
  if (!content) {
    return <></>;
  }
  return (
    <Link
      className={clsx(
        "text-base uppercase inline-block align-middle px-4 h4 border-2 rounded-md tracking-widest",
        borderColor,
        className,
        textColor,
        backgroundColor,
        type === "small" && "py-2 text-sm lg:text-base",
      )}
      href={href}
    >
      {content}
    </Link>
  );
};
export default Button;
