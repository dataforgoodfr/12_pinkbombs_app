import { useTranslations } from "next-intl";
import React from "react";

export interface DebunkProps {
  falseBelief: string;
  reality: string;
}

interface DebunkBlockProps extends DebunkProps {
  actNumber: number;
  index: number;
}

const DebunkBlock = ({
  falseBelief,
  reality,
  actNumber,
  index,
}: DebunkBlockProps) => {
  const t = useTranslations("site.toUnderstand");

  return (
    <div
      className="grid grid-cols-1 px-6 py-10 gap-4 md:grid-cols-2 md:gap-16 rounded-lg text-black bg-v2-pink"
      style={{ boxShadow: "6px 6px 0px 0px rgba(232, 45, 4, 1)" }}
    >
      <div className="flex flex-col gap-4">
        <h4 className="h4 uppercase">{falseBelief}</h4>
        <p className="p-lead">{reality}</p>
      </div>
      <div className="flex flex-col gap-5">
        <p className="p-body">
          {t.rich(`debunk.act${actNumber}.items.${index}.paragraph`, {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>
    </div>
  );
};
export default DebunkBlock;
