import clsx from "clsx";
import Image from "next/image";
import React from "react";

export interface MenuCardProps {
  className?: string;
  title: string;
  content: JSX.Element;
  imageAlt: string;
  index: number;
}

const MenuCard = ({
  className,
  title,
  content,
  imageAlt,
  index,
}: MenuCardProps) => {
  if (!title || !content || !imageAlt) {
    return <></>;
  }

  const getImageSrc = (index: number) => {
    switch (index) {
      case 0:
        return "/site/images/components/salmons.svg";
      case 1:
        return "/site/images/components/cereal.svg";
      case 2:
        return "/site/images/components/krill.svg";
      case 3:
        return "/site/images/components/sprayer.svg";
      case 4:
        return "/site/images/components/bottle.svg";
      case 5:
        return "/site/images/components/molecule.svg";
      default:
        return ""; 
    }
  };

  return (
    <div className={clsx(
      "flex flex-col rounded-lg items-center justify-center py-10 px-4 max-h-[450px] max-w-[409px] text-black bg-v2-pink",
      className,
      index % 2 === 0 ? "rotate-1" : "-rotate-1",
    )}>
      <Image
        loading="lazy"
        src={getImageSrc(index)}
        width={100}
        height={100}
        alt={imageAlt}
        className="object-cover mx-auto"
      />
      <p className="h4 text-center mt-4">{title}</p>
      <p className="p-body text-center mt-4 preserve-lines">
        {content}
      </p>
    </div>
  );
};
export default MenuCard;
