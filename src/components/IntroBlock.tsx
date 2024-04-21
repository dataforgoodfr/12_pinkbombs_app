import clsx from "clsx";
import React from "react";
import Image from "next/image";

const IconCard = ({
  className,
  title,
  image,
}: {
  className?: string;
  title: string;
  image?: string;
}) => {
  if (!title) {
    return <></>;
  }

  return (
    <header className={clsx(className, "grid grid-rows-[1fr, auto, 1fr] px-6 lg:px-12 py-3 lg:py-7 h-screen min-h-96 text-red1 bg-pink1")}>
      {image && <Image
        src="/images/salmon.svg"
        alt=""
        width={490}
        height={203}
        className="row-start-2 self-center justify-self-center w-24 sm:w-60 md:w-72 lg:w-[490px]"
      />}
      <h1 className={clsx("h1", "row-start-3 self-end items-left")}>
        {title}
      </h1>
    </header>
  );
};
export default IconCard;
