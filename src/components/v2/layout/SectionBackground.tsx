"use client";

import clsx from "clsx";

import { getSectionBackgroundClass } from "@/lib/sectionTheme";

import { usePathname } from "@/navigation";

// Paints the iOS overscroll bounce area: top matches the current section, bottom always stays blue
const SectionBackground = () => {
  const pathname = usePathname();

  return (
    <>
      <div
        aria-hidden="true"
        className={clsx(
          "fixed inset-x-0 top-0 h-32 -z-20",
          `bg-v2-${getSectionBackgroundClass(pathname)}`,
        )}
      />
      <div
        aria-hidden="true"
        className="fixed inset-x-0 bottom-0 h-32 -z-20 bg-v2-blue"
      />
    </>
  );
};

export default SectionBackground;
