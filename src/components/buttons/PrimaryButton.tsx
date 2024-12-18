import clsx from "clsx";
import Link from "next/link";
import React from "react";

const PrimaryButton = ({
  className,
  content,
  href = "#",
}: {
  className?: string;
  href?: string;
  content: JSX.Element | string;
}) => {
  if (!content) {
    return <></>;
  }
  return (
    <Link
      className={clsx(
        className,
        "inline-block p-4 lg:px-10 h4 border-2 border-red1 rounded-md tracking-widest text-yellow1 bg-red1 hover:text-red1 hover:bg-yellow1",
      )}
      href={href}
    >
      {content}
    </Link>
  );
};
export default PrimaryButton;
