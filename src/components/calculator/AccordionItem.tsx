"use client";

import { ChevronDown } from "lucide-react";
import type * as React from "react";

interface AccordionItemProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const AccordionItem = ({
  title,
  isActive,
  onClick,
  children,
}: AccordionItemProps) => (
  <div className="rounded-2xl border border-v2-pink">
    <button
      onClick={onClick}
      type="button"
      aria-expanded={isActive}
      className={`flex w-full items-center justify-between p-4 lg:p-6 text-left rounded-2xl focus:outline-hidden ${isActive ? "" : "hover:bg-v2-pink/10"}`}
    >
      <h4 className="h4 text-pretty text-v2-pink">{title}</h4>
      <ChevronDown
        className={`shrink-0 w-6 h-6 text-v2-pink transition-transform ${isActive ? "rotate-180 transform" : ""}`}
      />
    </button>
    <div
      className={`${
        isActive ? "grid-rows-[1fr] p-4 pt-0 lg:p-6 lg:pt-0" : "hidden"
      } grid transition-all duration-200`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  </div>
);
