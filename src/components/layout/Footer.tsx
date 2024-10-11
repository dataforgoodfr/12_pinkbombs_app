import Image from "next/image";
import { useTranslations } from "next-intl";

import MainLink from "@/components/links/MainLink";
import ShareLink from "@/components/links/shareLink";

const currentYear = new Date().getFullYear();

const Footer = () => {
  const t = useTranslations("layout");
  return (
    <footer className="p-6 lg:p-12 text-yellow1 bg-darkblue1">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-wrap gap-6 lg:gap-12 lg:pt-12">
          <div className="flex flex-col w-full max-w-72">
            <div className="flex place-items-center h-[100px]">
              <Image
                loading="lazy"
                src="/images/seastemik.avif"
                width={100}
                height={100}
                alt=""
                className="object-contain"
              />
            </div>
            <p className="h4 md:mb-4">Seastemik</p>
            <ShareLink href="https://seastemik.org/" name="Seastemik" />
            <ShareLink
              type="linkedin"
              href="https://www.linkedin.com/company/seastemik-org"
              name="Seastemik"
            />
            <ShareLink
              type="instagram"
              href="https://www.instagram.com/seastemik/"
              name="Seastemik"
            />
            <ShareLink
              type="newsletter"
              href="https://seastemik.org/newsletter"
              name="Seastemik"
            />
            <ShareLink
              type="email"
              href="info@seastemik.org"
              name="Seastemik"
            />
          </div>

          <div className="flex flex-col w-full max-w-72">
            <div className="h-[100px]">
              <Image
                loading="lazy"
                src="/images/dataforgood.svg"
                width={100}
                height={100}
                alt=""
                className="object-contain"
              />
            </div>
            <p className="h4 md:mb-4">Data for Good</p>
            <ShareLink href="https://dataforgood.fr/" name="Data for Good" />
            <ShareLink
              type="twitter"
              href="https://twitter.com/dataforgood_fr"
              name="Data for Good"
            />
            <ShareLink
              type="linkedin"
              href="https://www.linkedin.com/company/dataforgood"
              name="Data for Good"
            />
            <ShareLink
              type="email"
              href="hellodataforgood@gmail.com"
              name="Data for Good"
            />
          </div>

          <div className="self-end lg:ml-auto w-full md:w-auto">
            <MainLink
              label={t("footer.donation")}
              href="https://www.helloasso.com/associations/seastemik/formulaires/1"
              mode="base"
              className="mb-4"
              isBlank
            />
            <Image
              loading="lazy"
              src="/images/pinkbomb-seastemik-dataforgood.svg"
              width={400}
              height={100}
              alt=""
              className="object-contain"
            />
          </div>
        </div>

        <p className="p-caption mt-6 lg:mt-12">
          {t("footer.allRight")} - © {currentYear} Seastemik {t("footer.and")}{" "}
          Data for Good
          {/*<br />
          <a href="/legal-notice" className="underline hover:no-underline">
            {t("footer.legalNotice")}
          </a>*/}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
