import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ImageProps {
  alt: string;
  width: number;
  height: number;
}

export interface ArticleCardProps {
  id: number;
  title: string;
  type: "external" | "internal";
  image: ImageProps;
}

const ArticleCard = ({
  id,
  title,
  type = "internal",
  image,
}: ArticleCardProps) => {
  return (
    <>
      {id === 5 ? (
        <Link
          className="rounded-lg text-v2-blue bg-white flex flex-col justify-between md:col-span-2 md:flex-row lg:col-span-4 min-h-[412px]"
          style={{ boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)" }}
          href=""
          target="_blank"
        >
          <div className="flex flex-col justify-between md:max-w-[25%]">
            <h4 className="h4 m-4 text-pretty">{title}</h4>
            <div className="flex justify-end p-4">
              {type === "external" && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.41857 7.27471H4.88704V19.1129H16.7252V15.5814H19.2124V21.6H2.3999V4.78758H8.41857V7.27471ZM21.5999 11.6029H19.1128V6.64564L12.8779 12.8805L11.1194 11.122L17.3543 4.88716H12.397V2.40002H21.5999V11.6029Z"
                    fill="#E82D04"
                  />
                </svg>
              )}
            </div>
          </div>
          <Image
            loading="lazy"
            src={`/site/images/to-be-inspired/articles/${id}.png`}
            width={image.width}
            height={image.height}
            alt={image.alt}
            className="object-cover rounded-b-lg lg:rounded-r-lg mx-auto lg:col-span-3 overflow-hidden"
          />
        </Link>
      ) : (
        <Link
          className="rounded-lg text-v2-blue bg-white flex flex-col justify-between max-w-[302px]"
          style={{ boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)" }}
          href=""
          target="_blank"
        >
          <h4 className="h4 m-4 text-pretty">{title}</h4>
          <div className="flex justify-end p-4">
            {type === "external" && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.41857 7.27471H4.88704V19.1129H16.7252V15.5814H19.2124V21.6H2.3999V4.78758H8.41857V7.27471ZM21.5999 11.6029H19.1128V6.64564L12.8779 12.8805L11.1194 11.122L17.3543 4.88716H12.397V2.40002H21.5999V11.6029Z"
                  fill="#E82D04"
                />
              </svg>
            )}
          </div>
          <Image
            loading="lazy"
            src={`/site/images/to-be-inspired/articles/${id}.png`}
            width={image.width}
            height={image.height}
            alt={image.alt}
            className="object-cover rounded-b-lg mx-auto"
          />
        </Link>
      )}
    </>
  );
};
export default ArticleCard;
