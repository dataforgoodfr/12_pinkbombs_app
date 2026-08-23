import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en"] as const;
export const localesValues = ["fr", "en"];

export const localePrefix = "as-needed" as const;

export type basePathType =
  | "/"
  | "/archive/v1"
  | "/archive/v1/dashboard"
  | "/archive/v1/to-act"
  | "/archive/v1/about";

export const pathnames = {
  "/": "/",
  "/archive/v1": "/archive/v1",
  "/archive/v1/dashboard": "/archive/v1/dashboard",
  "/archive/v1/to-act": {
    fr: "/archive/v1/agir",
    en: "/archive/v1/to-act",
  },
  "/archive/v1/about": {
    fr: "/archive/v1/a-propos",
    en: "/archive/v1/about",
  },
} as const;

export const routing = defineRouting<
  typeof locales,
  "as-needed",
  typeof pathnames
>({
  locales,
  defaultLocale: "fr",
  localePrefix: "as-needed",
  pathnames,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
