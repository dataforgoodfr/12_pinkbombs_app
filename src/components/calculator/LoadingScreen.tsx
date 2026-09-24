"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export const LoadingScreen = () => {
  const t = useTranslations("site.calculator");

  return (
    <div className="flex flex-col justify-center items-center gap-8 px-4 mx-auto">
      <Image
        loading="lazy"
        src="/site/images/calculator/loading-fish.svg"
        width={314}
        height={173}
        alt=""
        className="object-cover w-[80%]"
      />
      <div className="gap-4 flex flex-col items-center text-center">
        <h2 className="h2 text-pretty text-v2-pink">{t("loading.title")}</h2>
        <p className="p-lead text-pretty text-v2-pink">
          {t("loading.caption")}
        </p>
        <p className="p-caption text-pretty italic text-v2-pink">
          {t("loading.info")}
        </p>
      </div>
    </div>
  );
};
