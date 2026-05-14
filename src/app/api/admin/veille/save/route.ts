import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "src/data/articles.json");

export async function POST(req: Request) {
  const { title, dek, body, rubrique, author, imgUrl, status = "draft" } = await req.json();
  if (!title || !rubrique) {
    return NextResponse.json({ error: "Titre et rubrique obligatoires." }, { status: 400 });
  }

  const articles = JSON.parse(readFileSync(FILE, "utf-8"));

  // Générer un slug unique
  const base = title
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const slug = articles.find((a: { slug: string }) => a.slug === base)
    ? `${base}-${Date.now()}`
    : base;

  // Convertir le corps texte en blocs body[]
  const paragraphs = (body ?? "")
    .split(/\n\n+/)
    .map((t: string) => t.trim())
    .filter(Boolean)
    .map((t: string) => ({ type: "p", text: t }));

  const now = new Date();
  const dateLabel = now.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const RUBRIQUE_LABELS: Record<string, string> = {
    senegal:"Sénégal", afrique:"Afrique", monde:"Monde",
    politique:"Politique", economie:"Économie", societe:"Société",
    sport:"Sport", culture:"Culture", diaspora:"Diaspora",
  };

  const newArticle = {
    slug,
    title,
    dek:          dek ?? "",
    rubrique,
    rubriqueLabel: RUBRIQUE_LABELS[rubrique] ?? rubrique,
    author:       author ?? "Rédaction À l'Heure",
    date:         dateLabel,
    dateIso:      now.toISOString(),
    readTime:     `${Math.max(2, Math.ceil(paragraphs.length * 1.5))} min`,
    imgSeed:      slug,
    imgUrl:       imgUrl || "",
    imgAlt:       title,
    badge:        null,
    featured:     false,
    status,
    commentCount: 0,
    tags:         [],
    authorBio:    "",
    body:         paragraphs,
  };

  // Insérer en tête de liste
  articles.unshift(newArticle);
  writeFileSync(FILE, JSON.stringify(articles, null, 2));

  return NextResponse.json({ ok: true, slug, status });
}
