"use client";

import clsx from "clsx";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

// import Link from "next/link";
import { basePathType, Link, locales, usePathname } from "@/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown } from "lucide-react";


type NavItemsProps = {
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
        "lg:fixed left-0 top-0 z-10 w-full",
        getBackgroundColor(),
        `text-v2-${getColor()}`
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
                item.link === pathname ? "navbar-active" : "",
                "hover:text-red1"
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
              <p className="font-secondary uppercase font-bold focus:text-red1 lg:text-2xl ">{item.text}</p>
              
            </Link>
          ))}

          <div className="flex gap-1 items-center">
            {locales.map((lang, keyLang) => (
              <Link
                className={clsx(
                  "px-2 py-1 rounded-md uppercase text-sm md:text-base hover:text-white hover:bg-red1 transition-colors ease-in-out duration-200",
                  lang === locale
                    ? "font-bold text-white bg-darkblue1"
                    : "text-darkblue1 bg-transparent",
                )}
                href={pathname}
                key={`lang-${keyLang}`}
                aria-current={lang === locale ? "page" : undefined}
                locale={lang}
              >
                {lang}
              </Link>
            ))}
          </div>
          <Menu as="div" className="relative inline-block">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20">
              Options
              <ChevronDown aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5 dark:data-focus:text-white"
                  >
                    Account settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5 dark:data-focus:text-white"
                  >
                    Support
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5 dark:data-focus:text-white"
                  >
                    License
                  </a>
                </MenuItem>
                <form action="#" method="POST">
                  <MenuItem>
                    <button
                      type="submit"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5 dark:data-focus:text-white"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </form>
              </div>
            </MenuItems>
          </Menu>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
