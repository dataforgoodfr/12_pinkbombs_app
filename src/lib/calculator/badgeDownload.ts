import type { ImpactLevel } from "./computeConsumption";

const badgeFilenames = {
  fr: {
    neutral: "Super_saumon.e.jpg",
    low: "Grand.e_saumon.e.jpg",
    medium: "Saumon.e_Ado.jpg",
    high: "B\u00e9b\u00e9_saumon.jpg",
    veryHigh: "Graine_de_saumon.jpg",
  },
  en: {
    neutral: "Super_Salmon.jpg",
    low: "Great_Salmon.jpg",
    medium: "Teen_Salmon.jpg",
    high: "Baby_Salmon.jpg",
    veryHigh: "Salmon_seed.jpg",
  },
} satisfies Record<"fr" | "en", Record<ImpactLevel, string>>;

export const getBadgeDownload = (impact: ImpactLevel, locale: string) => {
  const language = locale === "en" ? "en" : "fr";
  const filename = badgeFilenames[language][impact];

  return {
    href: `/site/images/calculator/download-badges-${language}/${encodeURIComponent(filename)}`,
    filename,
  };
};
