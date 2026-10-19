const localizedArticleTitles: Record<number, Record<"en" | "fr", string>> = {
  1: {
    en: "Salmon, a symbol of an industry",
    fr: "Les saumons, symbole d'une industrie",
  },
  2: {
    en: "SALMO, the incredible story of a wild salmon",
    fr: "SALMO, l’histoire incroyable d’un saumon sauvage",
  },
  3: {
    en: "5 misconceptions about fish (and why they are false)",
    fr: "5 idées reçues sur les poissons (et pourquoi elles sont fausses)",
  },
  4: {
    en: "5 salmon alternatives that are already changing the game",
    fr: "5 alternatives aux saumons qui changent (déjà) la donne",
  },
  5: {
    en: "5 things to know about salmon (instead of eating them)",
    fr: "5 choses à savoir sur les saumons (au lieu de les manger)",
  },
  6: {
    en: "When a French bakery chain takes salmon off its menu",
    fr: "Quand une enseigne de boulangerie française retire les saumons de son menu",
  },
  7: {
    en: "Does the Seastemik team still eat salmon?",
    fr: "L’équipe Seastemik mange-t-elle encore des saumons ?",
  },
  8: {
    en: "George Ka, salmon and ghosts",
    fr: "George Ka, les saumons et les fantômes",
  },
  9: {
    en: "11 organizations working to bring life back to the ocean",
    fr: "11 associations qui œuvrent pour repeupler l’Océan",
  },
};

export function getArticleSlug(title: string, id: number) {
  const normalizedTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${normalizedTitle}-${id}`;
}

export function getLocalizedArticleSlug(id: number, locale: "en" | "fr") {
  const title = localizedArticleTitles[id]?.[locale];
  return title ? getArticleSlug(title, id) : undefined;
}
