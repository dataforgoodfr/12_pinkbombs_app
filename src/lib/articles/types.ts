export interface ArticleTextSegment {
  type: "text" | "link";
  text: string;
  href?: string;
}

export type ArticleContentBlock =
  | { type: "paragraph"; segments: ArticleTextSegment[] }
  | { type: "heading"; text: string; strikethrough?: boolean }
  | { type: "list"; items: string[] }
  | { type: "image"; src?: string; alt: string; caption?: string }
  | { type: "youtube"; videoId: string; title: string };

export interface ArticleContent {
  id: number;
  title: string;
  summary: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageCredit?: string;
  heroTextSide?: "left" | "right";
  blocks: ArticleContentBlock[];
  relatedArticleIds?: number[];
}
