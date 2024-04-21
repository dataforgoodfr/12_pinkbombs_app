import clsx from "clsx";
import React from "react";
import Image from "next/image";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const IntroBlock = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={clsx(className, "bg-darkblue1 text-brown1")}>
      <div className="relative">
        <h2 className={clsx("h1", "relative z-[1]")}>
          Be the change.
        </h2>
        <Image
          src="/images/wave.svg"
          alt=""
          className="absolute top-0 z-0 "
          width={1000}
          height={600}
          loading="lazy"
        />
      </div>
      <div className="px-6 lg:px-12 pb-6 lg:pb-24 text-darkblue1 bg-brown1">
        <p className={clsx("h3", "pb-6 md:pb-12 xl:pb-32 max-w-3xl")}>
          There are alternatives to salmon in our way of eating, selling, and
          producing.
        </p>
        <Image
          src="/images/saumon.jpg"
          alt=""
          className="w-full h-96 xl:h-[690px] object-cover"
          width={1000}
          height={600}
          loading="lazy"
        />
      </div>
    {/*
    <div className="relative grid grid-cols-1 grid-rows-[repeat (3, 1fr)] list-none bg-darkblue1 text-lightblue1 px-6 pb-6 md:pb-16 lg:px-12 md:pt-8 lg:pt-28 2xl:pt-[10rem]">
      <div className="relative pt-10 pl-10 pb-12 md:py-18 md:pl-36 md:pt-2 2xl:pt-10 z-10 mix-blend-difference">
        <h2 className="uppercase text-2xl md:text-6xl lg:text-7xl">
          Be the change .
        </h2>
      </div>
      <div className="relative pb-6 md:pb-16 z-10 mix-blend-difference justify-self-center md:right-52 ">
        <p className="max-w-64 md:max-w-[30rem] md:text-xl lg:text-2xl font-secondary">
          There are alternatives to salmon in our way of eating, selling, and
          producing.
        </p>
      </div>
      <div className="relative justify-self-center z-10">
        <img
          src="/images/saumon.jpg"
          alt=""
          className="max-w-64 md:max-w-[68rem]"
        ></img>
      </div>
      <div className="absolute z-0">
        <img src="/svg/wave.svg" alt=""></img>
      </div>
    </div>
    */}

      <div className="p-6 md:p-12 xl:py-32 bg-yellow1 text-darkblue1">
        <div className="m-auto md:max-w-xl xl:max-w-4xl text-center font-secondary tracking-widest uppercase">
          <Image
            className="inline-block object-contain w-48 md:w-64 xl:w-[692px]"
            src="/images/eyes.svg"
            alt=""
            loading="lazy"
            width={692}
            height={134}
          />

          <p className="mt-6 xl:mt-10 text-xl//tight md:text-3xl//tight xl:text-6xl/tight font-bold">
            Join the collective effort against salmon farming by Signing the pledge below
          </p>

          <PrimaryButton
            href="/"
            content="Sign the pledge"
            className="mt-6 xl:mt-10"
          />
        </div>
      </div>
    </div>
  );
};
export default IntroBlock;
