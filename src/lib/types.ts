export type Rubrique =
  | "senegal"
  | "afrique"
  | "monde"
  | "politique"
  | "economie"
  | "societe"
  | "sport"
  | "culture"
  | "diaspora";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "blockquote"; text: string; cite?: string }
  | { type: "pullquote"; text: string };

export interface Article {
  slug: string;
  title: string;
  dek: string;
  rubrique: Rubrique;
  rubriqueLabel: string;
  author: string;
  date: string;          // display string
  dateIso: string;
  readTime: string;
  imgSeed: string;
  imgAlt: string;
  badge?: "live" | "video" | "rep" | "longformat";
  featured?: boolean;
  body?: ContentBlock[];
  authorBio?: string;
  tags?: string[];
  commentCount?: number;
}

export interface Podcast {
  letter: string;
  variant: "" | "b" | "g";
  show: string;
  title: string;
  duration: string;
  date: string;
}

export const RUBRIQUES_NAV: { label: string; slug: string }[] = [
  { label: "À la une", slug: "" },
  { label: "Sénégal",  slug: "senegal" },
  { label: "Afrique",  slug: "afrique" },
  { label: "Monde",    slug: "monde" },
  { label: "Politique",slug: "politique" },
  { label: "Économie", slug: "economie" },
  { label: "Société",  slug: "societe" },
  { label: "Sport",    slug: "sport" },
  { label: "Culture",  slug: "culture" },
  { label: "Diaspora", slug: "diaspora" },
];
