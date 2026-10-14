import Image from "next/image";
import React from "react";

import { Link } from "@/navigation";

interface ImageProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
}

export interface ArticleCardProps {
  id: number;
  title: string;
  slug: string;
  image: ImageProps;
}

const ArticleCard = ({
  id,
  title,
  slug,
  image,
}: ArticleCardProps) => {
  return (
    <>
      {id === 5 ? (
        <Link
          className="rounded-lg text-v2-blue bg-white flex max-h-[412px] flex-col justify-between overflow-hidden md:col-span-2 md:flex-row lg:col-span-4 hover:scale-105 transition-transform duration-300"
          style={{ boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)" }}
          href={{ pathname: "/to-be-inspired/[slug]", params: { slug } }}
        >
          <div className="flex flex-col justify-between md:max-w-[25%]">
            <h4 className="h4 m-4 text-pretty">{title}</h4>
          </div>
          <Image
            loading="lazy"
            src={image.src ?? `/site/images/to-be-inspired/articles/${id}.png`}
            width={image.width}
            height={image.height}
            alt={image.alt}
            className="mx-auto max-h-[242px] max-w-full object-cover overflow-hidden rounded-b-lg lg:col-span-3 lg:rounded-r-lg"
          />
        </Link>
      ) : (
        <Link
          className="rounded-lg text-v2-blue bg-white flex max-h-[412px] flex-col justify-between overflow-hidden max-w-[302px] hover:scale-105 transition-transform duration-300"
          style={{ boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)" }}
          href={{ pathname: "/to-be-inspired/[slug]", params: { slug } }}
        >
          <h4 className="h4 m-4 text-pretty">{title}</h4>
          <Image
            loading="lazy"
            src={image.src ?? `/site/images/to-be-inspired/articles/${id}.png`}
            width={image.width}
            height={image.height}
            alt={image.alt}
            className="mx-auto max-h-[242px] max-w-full object-cover overflow-hidden rounded-b-lg"
          />
        </Link>
      )}
    </>
  );
};
export default ArticleCard;
