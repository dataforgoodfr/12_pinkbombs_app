import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

import ShareLink from "@/components/v2/links/shareLink";
import { Link } from "@/navigation";
import Button from "@/components/v2/buttons/Button";

const currentYear = new Date().getFullYear();

const Footer = () => {
  const t = useTranslations("site.layout");
  const locale = useLocale();

  return (
    <footer className="p-6 lg:p-12 text-white bg-darkblue1">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-wrap gap-6 lg:gap-12 lg:pt-12">
          <div className="flex flex-col gap-6 w-full max-w-72">
            <h5 className="h5 uppercase">{t("footer.sections.projectBy.title")}</h5>
            <Image
              loading="lazy"
              src="/site/images/seastemik-x-dataforgood.svg"
              width={170}
              height={100}
              alt="Seastemik"
              className="object-contain"
            />
            <ShareLink href="https://seastemik.org/" name="Seastemik" type="site" />
          </div>

          <div className="flex flex-col gap-4 w-full max-w-72">
            <h5 className="h5 uppercase">{t("footer.sections.projectBy.site")}</h5>
            <Link
              className="text-base text-white underline underline-offset-2 hover:text-v2-yellow"
              href="/"
              locale={locale}
            >
              {t("nav.home")}
            </Link>
            <Link
              className="text-base text-white underline underline-offset-2 hover:text-v2-yellow"
              href="/to-understand"
              locale={locale}
            >
              {t("nav.toUnderstand")}
            </Link>
            <Link
              className="text-base text-white underline underline-offset-2 hover:text-v2-yellow"
              href="/to-act"
              locale={locale}
            >
              {t("nav.toAct")}
            </Link>
            <Link
              className="text-base text-white underline underline-offset-2 hover:text-v2-yellow"
              href="/to-be-inspired"
              locale={locale}
            >
              {t("nav.toBeInspired")}
            </Link>
          </div>


          <div className="flex flex-col gap-4 w-full max-w-72">
            <h5 className="h5 uppercase">{t("footer.sections.more.title")}</h5>
            <Link
              className="text-base text-white underline underline-offset-2 hover:text-v2-yellow"
              href="/about"
              locale={locale}
            >
              {t("nav.about")}
            </Link>
            <ShareLink href="https://seastemik.org/" type="sources" name={t("footer.shareLink.sources")} />
            <ShareLink href="https://seastemik.org/" type="legalNotices" name={t("footer.shareLink.legalNotices")} />
            <ShareLink href="https://seastemik.org/" type="contactUs" name={t("footer.shareLink.contactUs")} />
          </div>

          <div className="flex flex-col gap-4 self-top lg:ml-auto w-full md:w-auto">
            <h5 className="h5 uppercase">{t("footer.sections.stayInformed.title")}</h5>
            <p className="text-sm max-w-xs">{t("footer.sections.stayInformed.text")}</p>
            <form className="flex flex-col lg:flex-row gap-4 lg:gap-2 w-full max-w-xs">
              <input
                id="email"
                name="email"
                type="email"
                placeholder={t("footer.sections.stayInformed.newsletter.placeholder")}
                className="inline-block w-full rounded-md bg-white px-3 py-2 text-xs text-v2-blue placeholder:text-gray-400 placeholder:text-xs"
              />
              <Button
                content={t("footer.sections.stayInformed.newsletter.button")}
                href="https://www.helloasso.com/associations/seastemik/formulaires/1"
                type="small"
                backgroundColor="bg-white"
                textColor="text-v2-blue"
                borderColor="border-white"
              />
            </form>

          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center mt-6 lg:mt-12">
          <p className="text-xs">Seastemik - © {currentYear}</p>
          <br />
          <div className="flex gap-1 items-center justify-center">
            <p className="text-xs">design:</p>
            <ShareLink href="https://coucou.design/" type="design" name={t("footer.shareLink.design")} className="text-xs" />
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
