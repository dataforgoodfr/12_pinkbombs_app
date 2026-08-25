import clsx from "clsx";
import { useTranslations } from "next-intl";

type ShareLinkProps = {
  className?: string;
  type?:
    | "site"
    | "sources"
    | "legalNotices"
    | "contactUs"
    | "email"
    | "design";
  href: string;
  name: string;
};

const ShareLink = ({
  className,
  type = "site",
  href,
  name,
  ...rest
}: ShareLinkProps) => {
  const t = useTranslations("site.layout");

  if (!href || !name) {
    return <></>;
  }

  return (
    <a
      className={clsx("text-base underline hover:text-v2-yellow group", className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={`${t(`footer.shareLink.${type}`)} ${name} (${t("footer.shareLink.blank")})`}
      {...rest}
    >
      {t(`footer.shareLink.${type}`)}
      <span className="sr-only">{name}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16"
        className="inline-block ml-2 align-middle fill-white group-hover:fill-v2-yellow"
        viewBox="0 -960 960 960"
        width="16"
      >
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
      </svg>
    </a>
  );
};

export default ShareLink;
