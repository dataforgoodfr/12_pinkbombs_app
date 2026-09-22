import clsx from "clsx";
import Image from "next/image";
import React from "react";

import Button from "@/components/v2/buttons/Button";

import { basePathType, Link } from "@/navigation";

export interface PageCardProps {
  className?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  buttonCta: string;
  buttonUrl: basePathType;
}

const PageCard = ({
  className,
  title,
  description,
  imageSrc,
  imageAlt,
  buttonCta,
  buttonUrl,
}: PageCardProps) => {
  if (!title || !description || !imageAlt) {
    return <></>;
  }

  return (
    <div
      className={clsx(
        "flex flex-col rounded-lg max-w-[409px] text-v2-blue",
        className,
      )}
    >
      <Link href={buttonUrl}>
        <Image
          loading="lazy"
          src={imageSrc}
          width={400}
          height={284}
          alt={imageAlt}
          className="object-cover mx-auto hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <p className="h4 mt-4 text-pretty">{title}</p>
      <p className="p-lead my-4 preserve-lines">{description}</p>
      <Button
        type="small"
        content={buttonCta}
        href={buttonUrl}
        backgroundColor="bg-white"
        textColor="text-v2-blue"
        borderColor="border-v2-blue"
      />
    </div>
  );
};
export default PageCard;
