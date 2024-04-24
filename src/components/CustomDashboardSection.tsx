import Image from "next/image";
import React from "react";
import { ReactNode } from "react";

const CustomDashboardSection = ({
  title,
  id,
  mainContent,
  content,
}: {
  title?: string | undefined;
  mainContent?: string;
  content?: string | undefined;
  id: string;
  cta?: ReactNode | undefined;
}) => {
  return (
    <div id={id} className="p-6 md:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_2fr] max-w-[1500px] mx-auto">
        <div>
          <h3 className="h3 text-red1 py-8">{title}</h3>
          <p className="font-semibold">{mainContent}</p>
          <p className="py-7">{content}</p>
        </div>
        <div className="self-center px-24 min-h-[300px] overflow-y-auto h-full text-center">
          <Image
            src="/images/deforestation.webp"
            alt={id}
            width={700}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};
export default CustomDashboardSection;
