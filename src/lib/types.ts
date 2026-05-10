export type Rubrique =
  | "senegal"
  | "afrique"
  | "monde"
  | "politique"
  | "economie"
  | "societe"
  | "sport"
  | "culture"
  | "diaspora"
  | "environnement"
  | "sante";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "blockquote"; text: string; cite?: string }
  | { type: "pullquote"; text: string };

export type ArticleStatus = "published" | "draft" | "scheduled";

export interface Article {
  slug: string;
  title: string;
  dek: string;
  rubrique: Rubrique;
  rubriqueLabel: string;
  author: string;
  authorBio?: string;
  date: string;          // display string
  dateIso: string;
  publishAt?: string;    // ISO datetime for scheduled articles
  status?: ArticleStatus;
  readTime: string;
  imgSeed: string;
  imgUrl?: string;
  imgAlt: string;
  badge?: "live" | "video" | "rep" | "longformat";
  featured?: boolean;
  body?: ContentBlock[];
  tags?: string[];
  commentCount?: number;
}

export const KNOWN_AUTHORS: { name: string; bio: string; rubrique?: string }[] = [
  { name: "Aïssatou Ndoye", bio: "Grand reporter spécialisée dans les questions environnementales et d'économie bleue. Basée à Dakar, elle couvre l'Afrique de l'Ouest pour À l'Heure depuis 2019.", rubrique: "senegal" },
  { name: "Modou Fall", bio: "Correspondant permanent à Touba, Modou Fall couvre les événements religieux et la vie de la ville sainte depuis 2017.", rubrique: "senegal" },
  { name: "Fatou Diallo", bio: "Journaliste spécialisée dans les questions de mobilité urbaine et d'aménagement du territoire.", rubrique: "senegal" },
  { name: "Cheikh Sarr", bio: "Journaliste économique spécialisé dans les industries extractives. Il suit le dossier pétrole-gaz au Sénégal depuis 2021.", rubrique: "economie" },
  { name: "Rokhaya Diop", bio: "Correspondante politique à l'Assemblée nationale.", rubrique: "politique" },
  { name: "Aminata Traoré", bio: "Journaliste économique, ancienne de RFI, spécialiste de la zone franc et des politiques monétaires africaines.", rubrique: "economie" },
  { name: "Mamadou Diallo", bio: "Grand reporter spécialisé dans les ressources naturelles et la gouvernance économique en Afrique.", rubrique: "economie" },
  { name: "Aminata Seck", bio: "Journaliste société, spécialisée dans les questions de migration et de droits humains.", rubrique: "societe" },
  { name: "Pape Sow", bio: "Journaliste sportif, spécialiste de la lutte sénégalaise et des sports de combat.", rubrique: "sport" },
  { name: "Marie-Hélène Badji", bio: "Journaliste culturelle, critique d'art contemporain africain.", rubrique: "culture" },
  { name: "Sokhna Fall", bio: "Journaliste culturelle, critique de cinéma, spécialiste des cinémas africains.", rubrique: "culture" },
  { name: "Bineta Sy", bio: "Envoyée spéciale en Europe, elle couvre la diaspora sénégalaise pour À l'Heure depuis Paris.", rubrique: "diaspora" },
  { name: "Awa Ndiaye", bio: "Journaliste spécialisée dans les enjeux numériques et technologiques pour l'Afrique.", rubrique: "monde" },
  { name: "Service Politique", bio: "La rédaction politique d'À l'Heure.", rubrique: "politique" },
  { name: "Service Culture", bio: "La rédaction culture d'À l'Heure.", rubrique: "culture" },
  { name: "Service Afrique", bio: "La rédaction Afrique d'À l'Heure.", rubrique: "afrique" },
  { name: "Service International", bio: "La rédaction internationale d'À l'Heure.", rubrique: "monde" },
  { name: "Bureau d'Abidjan", bio: "Le bureau d'À l'Heure à Abidjan, Côte d'Ivoire.", rubrique: "afrique" },
  { name: "Bureau Washington", bio: "Le bureau d'À l'Heure à Washington D.C.", rubrique: "monde" },
  { name: "Édition Sport", bio: "La rédaction sport d'À l'Heure.", rubrique: "sport" },
];

export interface Podcast {
  letter: string;
  variant: "" | "b" | "g";
  show: string;
  title: string;
  duration: string;
  date: string;
}

export const RUBRIQUES_NAV: { label: string; slug: string }[] = [
  { label: "À la une",      slug: "" },
  { label: "Sénégal",       slug: "senegal" },
  { label: "Afrique",       slug: "afrique" },
  { label: "Monde",         slug: "monde" },
  { label: "Politique",     slug: "politique" },
  { label: "Économie",      slug: "economie" },
  { label: "Société",       slug: "societe" },
  { label: "Sport",         slug: "sport" },
  { label: "Culture",       slug: "culture" },
  { label: "Diaspora",      slug: "diaspora" },
  { label: "Environnement", slug: "environnement" },
  { label: "Santé",         slug: "sante" },
];
