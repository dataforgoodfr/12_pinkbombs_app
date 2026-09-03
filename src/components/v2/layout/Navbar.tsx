"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { basePathType, Link, locales, usePathname } from "@/navigation";

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
    if (
      /to-act/.test(pathname) ||
      /to-be-inspired/.test(pathname) ||
      /about/.test(pathname) ||
      /calculator/.test(pathname)
    ) {
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
            className="w-24 md:w-36 lg:w-44 h-auto object-contain"
          />
        </Link>

        <nav
          className="flex flex-wrap gap-4 lg:gap-10 ml-auto"
          aria-label={t("nav.title")}
        >
          {navItems.map((item, key) => (
            <Link
              className={clsx(
                "flex transition-colors ease-in-out duration-200 group",
                item.link === pathname
                  ? getColor() === "blue"
                    ? "navbar-active-blue"
                    : "navbar-active-pink"
                  : "",
                getColor() === "blue" ? "text-v2-blue" : "text-v2-pink",
                "hover:text-v2-magenta",
              )}
              href={item.link as basePathType}
              aria-current={item.link === pathname ? "page" : undefined}
              key={`nav-${key}`}
            >
              {item.link === "/calculator" && (
                <div className="inline-block self-center mr-2">
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    className={`${
                      getColor() === "blue" ? "fill-v2-blue group-hover:fill-v2-magenta" : "fill-v2-pink group-hover:fill-v2-magenta"
                    } group-hover:fill-v2-magenta`} 
                    d="M0.00643467 0C0.74725 0.0151179 1.54567 0.00169509 2.29101 0.00171221H6.69507L20 0.0011986C19.9655 1.75243 19.9942 3.59265 19.9942 5.34953L19.994 15.4484V18.9416C19.9942 19.533 19.9979 20.1284 19.9933 20.7184C19.9907 21.0598 19.8022 21.4111 19.5419 21.6361C19.2259 21.9094 18.903 22.0164 18.4851 21.9951C17.8734 21.9642 17.3582 21.564 17.2007 20.9912C17.1191 20.6434 17.1488 20.307 16.8788 20.0262C16.6467 19.785 16.3208 19.7501 16.0529 19.9651C15.6688 20.2731 15.7708 20.7059 15.6228 21.1103C15.5355 21.3485 15.3975 21.5074 15.2088 21.6769C14.4006 22.2978 13.2378 21.9953 12.9169 21.0136C12.8051 20.6719 12.9036 20.3281 12.5968 20.032C12.3481 19.7918 12.0403 19.7403 11.7604 19.9663C11.3896 20.27 11.4943 20.6558 11.3732 21.0237C11.2962 21.253 11.1611 21.4599 10.9807 21.6255C10.6819 21.8977 10.3407 22.0119 9.93562 21.9981C9.32878 21.9768 8.80402 21.5808 8.63286 21.015C8.52453 20.6583 8.61477 20.3183 8.29976 20.0214C7.81856 19.5681 7.27924 19.9576 7.17664 20.4955C7.14178 20.6784 7.13268 20.8612 7.07598 21.0355C7.00405 21.2553 6.87767 21.4546 6.7079 21.6157C6.41016 21.8964 6.06916 22.0058 5.66096 21.996C5.05126 21.985 4.52009 21.5894 4.35091 21.0203C4.24348 20.6671 4.32351 20.3212 3.9993 20.0052C3.87639 19.8845 3.70734 19.8189 3.53269 19.8242C3.21642 19.8324 3.02836 20.1007 2.92881 20.3632C2.84454 20.5828 2.86276 20.8213 2.78849 21.0439C2.40824 22.1831 0.808888 22.3448 0.190396 21.3089C-0.0538985 20.8997 0.00617044 20.4991 0.007369 20.0406L0.00865565 18.7439L0.00853194 14.4338L0.00643467 0ZM7.60197 16.6453L17.1048 16.647L17.106 15.3169C16.2302 15.3022 15.3281 15.3125 14.4508 15.3125L9.62082 15.313C8.96026 15.3131 8.26086 15.3248 7.60291 15.3145L7.60197 16.6453ZM7.60219 4.53553C8.90599 4.55011 10.2309 4.53878 11.5371 4.53871L17.1053 4.53797L17.1057 3.20659L7.60333 3.20493L7.60219 4.53553ZM7.60196 12.6243L17.1055 12.6262V11.2984C16.2896 11.2744 15.3952 11.2926 14.5728 11.2926L9.8207 11.2929C9.09443 11.2931 8.32751 11.3061 7.60419 11.2958C7.6004 11.7386 7.59967 12.1815 7.60196 12.6243ZM4.07955 10.6353C3.32479 10.7456 2.80535 11.4299 2.91973 12.1629C3.0341 12.8958 3.73893 13.3999 4.49345 13.2881C5.24698 13.1764 5.76492 12.4928 5.65068 11.7609C5.53647 11.0288 4.83328 10.525 4.07955 10.6353ZM4.14645 14.644C3.38768 14.7184 2.83458 15.3761 2.91088 16.1132C2.98718 16.8503 3.66398 17.3879 4.42283 17.3141C5.18215 17.2401 5.73597 16.5823 5.65964 15.8447C5.58328 15.1072 4.90571 14.5696 4.14645 14.644ZM4.17799 2.58877C3.41815 2.64625 2.8497 3.29048 2.90744 4.02866C2.96519 4.76685 3.62734 5.32024 4.3874 5.26552C5.14947 5.21066 5.72103 4.5654 5.66313 3.82526C5.60523 3.08511 4.93985 2.53114 4.17799 2.58877ZM4.1017 6.61433C3.34765 6.71256 2.8173 7.38456 2.91552 8.11741C3.01371 8.85024 3.70346 9.36798 4.45827 9.27544C5.21724 9.18239 5.75385 8.50791 5.65511 7.77103C5.55637 7.03416 4.85992 6.51556 4.1017 6.61433ZM7.60381 7.27969C7.60081 7.72342 7.60012 8.16718 7.60171 8.61092L17.1041 8.61287L17.1051 7.28375L10.5506 7.28096L8.58678 7.28156C8.33576 7.28176 7.8392 7.29705 7.60381 7.27969Z"/>
                </svg>

                </div>

              )}
              <p className="cta tracking-wider focus:text-v2-red">
                {item.text}
              </p>
            </Link>
          ))}

          <Menu as="div" className="relative block">
            <MenuButton
              className={clsx(
                "flex justify-between items-center border border-1 px-3 rounded-md cta focus:text-v2-red transition-colors ease-in-out duration-200 group",
                `${getColor() === "blue" ? "border-v2-blue text-v2-blue" : "border-v2-pink text-v2-pink"}`,
                "hover:text-v2-magenta",
              )}
            >
              {locale.toUpperCase()}
              <div className="inline-block self-center ml-2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8L1 3H9L5 8Z" className={`${
                  getColor() === "blue" ? "fill-v2-blue" : "fill-v2-pink"
                } group-hover:fill-v2-magenta`} />
                </svg>
              </div>


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
                          ? getColor() === "blue"
                            ? "text-white bg-v2-blue"
                            : "text-v2-blue bg-v2-pink"
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
