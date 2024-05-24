"use client";

import clsx from "clsx";
import Image from "next/image";
// import Link from "next/link";
import { Link, basePathType, usePathname } from "../../navigation";
import { useTranslations } from "next-intl";

type NavItemsProps = {
  link: string;
  text: string;
}[];

const Navbar = () => {
  const t = useTranslations("layout");
  const pathname = usePathname();

  const navItems: NavItemsProps = [
    {
      link: "/",
      text: t("nav.story"),
    },
    {
      link: "/dashboard",
      text: t("nav.dashboard"),
    },
    {
      link: "/to-act",
      text: t("nav.act"),
    },
    {
      link: "/about",
      text: t("nav.about"),
    },
  ];

  return (
    <header className="absolute left-0 top-0 z-10 w-full">
      <div className="flex flex-wrap items-center justify-between px-6 lg:px-12 py-3 lg:py-6">
        <Link href="/">
          <Image
            src="/images/pinkbombs.svg"
            alt="PinkBombs"
            width={176}
            height={43}
            className="w-24 md:w-36 lg:w-44 object-contain"
          />
        </Link>

        <nav className="flex gap-4 lg:gap-16" aria-label="Main navigation">
          {navItems.map((item, key) => (
            <Link
              className={clsx(
                "font-secondary uppercase font-bold text-darkblue1 hover:text-red1 focus:text-red1 lg:text-2xl",
                item.link === pathname ? "navbar-active" : "",
              )}
              href={item.link as basePathType}
              aria-current={item.link === pathname ? "page" : undefined}
              key={`nav-${key}`}
            >
              {item.text}
            </Link>
          ))}
          <Link href={pathname} locale="fr">
            FR
          </Link>
          <Link href={pathname} locale="en">
            EN
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
