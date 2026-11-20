const localizedArticleTitles: Record<
  number,
  Record<"en" | "fr" | "es", string>
> = {
  1: {
    en: "Salmon, a symbol of an industry",
    fr: "Les saumons, symbole d'une industrie",
    es: "Los salmones, símbolo de toda una industria",
  },
  2: {
    en: "SALMO, the incredible story of a wild salmon",
    fr: "SALMO, l'histoire incroyable d'un saumon sauvage",
    es: "SALMO, la increíble historia de un salmón silvestre",
  },
  3: {
    en: "5 misconceptions about fish (and why they are false)",
    fr: "5 idées reçues sur les poissons (et pourquoi elles sont fausses)",
    es: "5 mitos sobre los peces (y por qué no son ciertos)",
  },
  4: {
    en: "5 salmon alternatives that are game-changer",
    fr: "5 alternatives aux saumons qui changent (déjà) la donne",
    es: "Alternativas al salmón: 5 opciones que ya están haciendo la diferencia",
  },
  5: {
    en: "5 things to know about salmon (instead of eating them)",
    fr: "5 choses à savoir sur les saumons (au lieu de les manger)",
    es: "5 cosas que debes saber sobre los salmones (en vez de comértelos)",
  },
  6: {
    en: "When a French bakery chain takes salmon off its menu",
    fr: "Quand une enseigne de boulangerie française retire les saumons de son menu",
    es: "Cuando una cadena francesa de panaderías decide retirar el salmón de su menú",
  },
  7: {
    en: "Does the Seastemik team still eat salmon?",
    fr: "L'équipe Seastemik mange-t-elle encore des saumons ?",
    es: "¿El equipo de Seastemik sigue comiendo salmón?",
  },
  8: {
    en: "George Ka, salmon and ghosts",
    fr: "George Ka, les saumons et les fantômes",
    es: "George Ka, los salmones y los fantasmas",
  },
  9: {
    en: "11 organizations working to bring life back to the ocean",
    fr: "11 associations qui œuvrent pour repeupler l'Océan",
    es: "11 organizaciones que trabajan para devolverle la vida al océano",
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

export function getLocalizedArticleSlug(
  id: number,
  locale: "en" | "fr" | "es",
) {
  const title = localizedArticleTitles[id]?.[locale];
  return title ? getArticleSlug(title, id) : undefined;
}
