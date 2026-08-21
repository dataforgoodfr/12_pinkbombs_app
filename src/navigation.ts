import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from "next-intl/navigation";

export const locales = ["fr", "en"] as const;
export const localesValues = ["fr", "en"];
export const localePrefix = "as-needed";
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
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });
