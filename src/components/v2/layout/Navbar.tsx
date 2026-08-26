"use client";

import clsx from "clsx";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { basePathType, Link, locales, usePathname } from "@/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown } from "lucide-react";


export type NavItemsProps = {
  link: string;
  text: string;
}[];

const Navbar = () => {
  const t = useTranslations("site.layout");
  const pathname = usePathname();
  const locale = useLocale();

  const navItems: NavItemsProps = [
    {
      link: "/to-understand",
      text: t("nav.toUnderstand"),
    },
    {
      link: "/to-act",
      text: t("nav.toAct"),
    },
    {
      link: "/to-be-inspired",
      text: t("nav.toBeInspired"),
    },
    {
      link: "/calculator",
      text: t("nav.calculator"),
    },
    {
      link: "/about",
      text: t("nav.about"),
    },
  ];
  const getBackgroundColor = () => {
    if (/to-act/.test(pathname)) {
      return "bg-v2-green";
    } else if (/to-be-inspired/.test(pathname)) {
      return "bg-v2-yellow";
    } else if (/about/.test(pathname) || /calculator/.test(pathname)) {
      return "bg-v2-pink";
    } else {
      return "bg-v2-blue";
    }
  };

  const getColor = () => {
    if (/to-act/.test(pathname) || /to-be-inspired/.test(pathname) || /about/.test(pathname) || /calculator/.test(pathname)) {
      return "blue";
    } else {
      return "pink";
    }
  };

  return (
    <header
      className={clsx(
        "lg:fixed left-0 top-0 z-50 w-full",
        getBackgroundColor(),
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-6 px-6 lg:px-12 py-3 lg:py-6 max-w-[1596px] mx-auto">
        <Link href="/">
          <Image
            src={`/site/images/pinkbombs-${getColor()}.svg`}
            alt="PinkBombs"
            width={176}
            height={43}
            className="w-24 md:w-36 lg:w-44 object-contain"
          />
        </Link>

        <nav
          className="flex flex-wrap gap-4 lg:gap-16 ml-auto"
          aria-label={t("nav.title")}
        >
          {navItems.map((item, key) => (
            <Link
              className={clsx(
                "flex transition-colors ease-in-out duration-200",
                item.link === pathname ? (getColor() === "blue" ? "navbar-active-blue" : "navbar-active-pink") : "",
                getColor() === "blue" ? "text-v2-blue" : "text-v2-pink",
                "hover:text-v2-magenta"
              )}
              href={item.link as basePathType}
              aria-current={item.link === pathname ? "page" : undefined}
              key={`nav-${key}`}
            >
              {item.link === "/calculator" && (
                  <Image
                    src={`/site/images/calculator-${getColor()}.svg`}
                    alt="Calculator"
                    width={20}
                    height={22}
                    className="inline-block self-center mr-2"
                  />
              )}
              <p className="cta focus:text-v2-red">{item.text}</p>
              
            </Link>
          ))}

          <Menu as="div" className="relative block">
            <MenuButton 
              className={clsx(
                "flex justify-between items-center border border-1 px-3 rounded-md cta focus:text-v2-red transition-colors ease-in-out duration-200",
                `${getColor() === "blue" ? "border-v2-blue text-v2-blue" : "border-v2-pink text-v2-pink"}`,
                "hover:text-v2-magenta"
              )}
            >
              {locale.toUpperCase()}
              <Image
                src={`/site/images/chevron-down-${getColor()}.svg`}
                alt="Chevron Down"
                width={10}
                height={10}
                className="inline-block self-center ml-2"
              />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg outline-hidden transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
            >
              <div className="py-1">
                {locales.map((lang, keyLang) => (
                  <MenuItem key={`lang-${keyLang}`}>
                    <Link
                      className={clsx(
                        "block px-4 py-2 cta outline-hidden",
                        lang === locale
                          ? getColor() === "blue" ? "text-white bg-v2-blue" : "text-v2-blue bg-v2-pink"
                          : "text-v2-blue",
                      )}
                      href={pathname}
                      key={`lang-${keyLang}`}
                      aria-current={lang === locale ? "page" : undefined}
                      locale={lang}
                    >
                      {lang.toUpperCase()}
                    </Link>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
