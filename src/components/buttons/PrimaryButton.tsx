import clsx from "clsx";
import React from "react";
import Link from "next/link";

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
    return <></>
  }
  return (
    <Link className={clsx(className, "inline-block p-4 lg:px-10 text-xl xl:text-[2.5rem] rounded-md tracking-widest font-black text-yellow1 bg-red1 hover:text-red1 hover:bg-yellow1")} href={href}>
      {content}
    </Link>
  );
};
export default PrimaryButton;
