import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { siteConfig } from "@/constant/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type LegalBlock =
  | { type: "paragraph" | "heading"; text: string }
  | { type: "list"; items: string[] };

type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

const linkClassName =
  "break-words underline underline-offset-4 hover:text-v2-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

const links = {
  website: (chunks: ReactNode) => (
    <a className={linkClassName} href={siteConfig.url}>
      {chunks}
    </a>
  ),
  email: (chunks: ReactNode) => (
    <a className={linkClassName} href="mailto:info@seastemik.org">
      {chunks}
    </a>
  ),
  vercel: (chunks: ReactNode) => (
    <a className={linkClassName} href="https://vercel.com">
      {chunks}
    </a>
  ),
  license: (chunks: ReactNode) => (
    <a
      className={linkClassName}
      href="https://creativecommons.org/licenses/by/4.0/deed.fr"
    >
      {chunks}
    </a>
  ),
  cnil: (chunks: ReactNode) => (
    <a className={linkClassName} href="https://www.cnil.fr">
      {chunks}
    </a>
  ),
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site.legal" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function LegalNoticesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site.legal" });
  const sections = t.raw("sections") as LegalSection[];

  return (
    <article className="bg-white px-6 py-12 text-darkblue1 md:px-12 md:py-20">
      <div className="mx-auto max-w-3xl text-base leading-7">
        <header className="mb-10 border-b border-darkblue1/20 pb-8">
          <h1 className="text-3xl font-bold md:text-4xl">{t("title")}</h1>
          <p className="mt-4 text-lg font-bold">{t("subtitle")}</p>
          <p className="mt-3">{t("effectiveDate")}</p>
        </header>
        <p>{t.rich("intro", links)}</p>
        {sections.map((section, sectionIndex) => (
          <section
            aria-labelledby={`legal-section-${sectionIndex}`}
            className="mt-10"
            key={section.title}
          >
            <h2
              className="mb-5 text-xl font-bold md:text-2xl"
              id={`legal-section-${sectionIndex}`}
            >
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.blocks.map((block, blockIndex) => {
                const messageKey = `sections.${sectionIndex}.blocks.${blockIndex}`;

                if (block.type === "list") {
                  return (
                    <ul className="list-disc space-y-2 pl-6" key={messageKey}>
                      {block.items.map((item, itemIndex) => (
                        <li key={item}>
                          {t.rich(`${messageKey}.items.${itemIndex}`, links)}
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "heading") {
                  return (
                    <h3 className="pt-4 text-lg font-bold" key={messageKey}>
                      {block.text}
                    </h3>
                  );
                }

                return (
                  <p key={messageKey}>{t.rich(`${messageKey}.text`, links)}</p>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
