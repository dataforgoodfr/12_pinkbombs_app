import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";

import { type basePathType, Link } from "@/navigation";

type ShareLinkProps = {
  className?: string;
  type?: "site" | "sources" | "legalNotices" | "contactUs" | "email" | "design";
  href: string;
  name: string;
  customName?: string;
  iconFillColor?: string;
};

const ShareLink = ({
  className,
  type = "site",
  href,
  name,
  customName,
  iconFillColor,
}: ShareLinkProps) => {
  const t = useTranslations("site.layout");
  const locale = useLocale();
  const isExternal = /^https?:\/\//i.test(href);
  const isMailto = /^mailto:/i.test(href);
  const label = customName ?? t(`shareLink.${type}`);
  const accessibleName = [
    label,
    name !== label ? name : undefined,
    isExternal ? `(${t("shareLink.blank")})` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  if (!href || !name) {
    return null;
  }

  const content = (
    <>
      {label}
      {isExternal && (
        <svg
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          className={`inline-block ml-2 align-middle ${iconFillColor ?? "fill-white group-hover:fill-v2-yellow"}`}
          viewBox="0 -960 960 960"
          width="16"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
        </svg>
      )}
    </>
  );
  console.log({className});
  const linkClassName = clsx("text-base group", className);

  if (isExternal || isMailto) {
    return (
      <a
        className={linkClassName}
        href={href}
        aria-label={accessibleName}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  const [pathname, hash] = href.split("#", 2);

  return (
    <Link
      className={linkClassName}
      href={{ pathname: pathname as basePathType, hash }}
      locale={locale}
      aria-label={accessibleName}
    >
      {content}
    </Link>
  );
};

export default ShareLink;
