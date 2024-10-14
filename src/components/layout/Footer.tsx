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
            <Image
              loading="lazy"
              src="/images/seastemik.svg"
              width={170}
              height={100}
              alt="Seastemik"
              className="object-contain md:mb-4"
            />
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
            <Image
              loading="lazy"
              src="/images/dataforgood.svg"
              width={150}
              height={100}
              alt="Data for Good"
              className="object-contain md:mb-4"
            />
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

          <div className="self-top lg:ml-auto w-full md:w-auto">
            <Image
              loading="lazy"
              src="/images/pinkbomb-seastemik-dataforgood.svg"
              width={300}
              height={100}
              alt=""
              className="object-contain mb-4"
            />
            <MainLink
              label={t("footer.donation")}
              href="https://www.helloasso.com/associations/seastemik/formulaires/1"
              mode="base"
              isBlank
            />
          </div>
        </div>

        <p className="p-caption mt-6 lg:mt-12">
          {t("footer.allRight")} - © {currentYear} Seastemik {t("footer.and")}{" "}
          Data for Good
          <br />
          <a href="/legal-notice" className="underline hover:no-underline">
            {t("footer.legalNotice")}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
