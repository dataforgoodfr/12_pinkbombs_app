import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

export interface IllustratedDebunkBlockProps {
  falseBelief: string;
  reality: string;
  imageAlt: string;
  catchPhrase: string;
  actNumber: number;
  index: number;
  imageExtension?: string;
}

const IllustratedDebunkBlock = ({
  falseBelief,
  reality,
  imageAlt,
  imageExtension,
  catchPhrase,
  actNumber,
  index,
}: IllustratedDebunkBlockProps) => {
  const t = useTranslations("site.toUnderstand");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-16 text-black">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h3 className="h3 uppercase text-v2-red line-through decoration-1">
            {falseBelief}
          </h3>
          <h3 className="h3 text-v2-blue">{reality}</h3>
        </div>
        <p className="p-body preserve-lines">
          {t.rich(`debunk.act${actNumber}.items.${index}.paragraph`, {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <Image
          loading="lazy"
          src={`/site/images/to-understand/act${actNumber}-${index + 1}.${imageExtension || "svg"}`}
          width={606}
          height={387}
          alt={imageAlt}
          className="object-cover rounded-xl"
        />
        <p className="p-lead">{catchPhrase}</p>
      </div>
    </div>
  );
};
export default IllustratedDebunkBlock;
