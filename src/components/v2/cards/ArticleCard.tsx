import Image from "next/image";
import React from "react";

import { Link } from "@/navigation";

interface ImageProps {
  src?: string;
  alt: string;
}

export interface ArticleCardProps {
  id: number;
  title: string;
  slug: string;
  image: ImageProps;
  variant?: "standard" | "wide";
}

const ArticleCard = ({
  id,
  title,
  slug,
  image,
  variant = "standard",
}: ArticleCardProps) => {
  const imageSrc =
    image.src ?? `/site/images/to-be-inspired/articles/${id}.png`;

  return (
    <>
      {variant === "wide" ? (
        <Link
          className="flex h-[412px] w-full flex-col overflow-hidden rounded-lg bg-white text-v2-blue transition-transform duration-300 hover:scale-105 md:col-span-2 md:flex-row lg:col-span-4"
          style={{ boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)" }}
          href={{ pathname: "/to-be-inspired/[slug]", params: { slug } }}
        >
          <div className="h-[170px] w-full shrink-0 overflow-hidden md:h-full md:w-1/4">
            <h4 className="h4 m-4 line-clamp-5 text-pretty">{title}</h4>
          </div>
          <div className="relative h-[242px] w-full shrink-0 overflow-hidden md:h-full md:w-3/4">
            <Image
              loading="lazy"
              src={imageSrc}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 100vw, 75vw"
              className="object-cover"
            />
          </div>
        </Link>
      ) : (
        <Link
          className="flex h-[412px] w-full max-w-[302px] flex-col overflow-hidden rounded-lg bg-white text-v2-blue transition-transform duration-300 hover:scale-105"
          style={{ boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)" }}
          href={{ pathname: "/to-be-inspired/[slug]", params: { slug } }}
        >
          <div className="h-[170px] w-full shrink-0 overflow-hidden">
            <h4 className="h4 m-4 line-clamp-5 text-pretty">{title}</h4>
          </div>
          <div className="relative h-[242px] w-full shrink-0 overflow-hidden">
            <Image
              loading="lazy"
              src={imageSrc}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 100vw, 302px"
              className="object-cover"
            />
          </div>
        </Link>
      )}
    </>
  );
};
export default ArticleCard;
