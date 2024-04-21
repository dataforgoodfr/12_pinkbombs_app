import clsx from "clsx";
import React from "react";
import Image from "next/image";

const IntroBlock = ({
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
    <header className={clsx(className, "flex p-6 lg:p-12 min-h-[300px] h-screen max-h-[900px] text-red1 bg-pink1")}>
      <div className="grid grid-rows-[1fr, auto, 1fr] w-full max-w-[1500px] mx-auto">
        {image && <Image
          src="/images/salmon.svg"
          alt=""
          width={490}
          height={203}
          className="row-start-2 self-center justify-self-center w-24 sm:w-60 md:w-72 lg:w-[490px]"
        />}
        <div className="row-start-3 self-end items-left flex gap-2 items-end">
          <h1 className={clsx("h1", "w-full")}>
            {title}
          </h1>
          <Image
            src="/images/bottom.svg"
            alt=""
            width="50" height="37"
          />
        </div>
      </div>
    </header>
  );
};
export default IntroBlock;
