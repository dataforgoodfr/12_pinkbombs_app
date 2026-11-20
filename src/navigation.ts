import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en", "es"] as const;
export const localesValues = ["fr", "en", "es"];

export const localePrefix = "as-needed" as const;

export type basePathType =
  | "/"
  | "/to-understand"
  | "/to-act"
  | "/to-be-inspired"
  | "/pinkometer"
  | "/about"
  | "/legal-notices"
  | "/archive/v1"
  | "/archive/v1/dashboard"
  | "/archive/v1/to-act"
  | "/archive/v1/about";

export const pathnames = {
  "/": "/",
  "/to-understand": {
    fr: "/comprendre",
    en: "/to-understand",
    es: "/informarse",
  },
  "/to-act": {
    fr: "/agir",
    en: "/to-act",
    es: "/pasar-a-la-accion",
  },
  "/to-be-inspired": {
    fr: "/s-inspirer",
    en: "/to-be-inspired",
    es: "/descubrir-alternativas",
  },
  "/to-be-inspired/[slug]": {
    fr: "/s-inspirer/[slug]",
    en: "/to-be-inspired/[slug]",
    es: "/descubrir-alternativas/[slug]",
  },
  "/pinkometer": {
    fr: "/pinkometre",
    en: "/pinkometer",
    es: "/pinkometro",
  },
  "/about": {
    fr: "/a-propos",
    en: "/about",
    es: "/sobre-nosotros",
  },
  "/legal-notices": {
    fr: "/mentions-legales",
    en: "/legal-notices",
    es: "/aviso-legal",
  },
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
  "/archive/v1/legal-notices": {
    fr: "/archive/v1/mentions-legales",
    en: "/archive/v1/legal-notices",
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
