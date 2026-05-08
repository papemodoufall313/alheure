import { NextResponse } from "next/server";
import { getAllArticles, saveAllArticles } from "@/lib/articles";
import { revalidatePath } from "next/cache";
import type { Article } from "@/lib/types";

interface Props { params: Promise<{ slug: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { slug } = await params;
  const article = getAllArticles().find((a) => a.slug === slug);
  if (!article) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: Request, { params }: Props) {
  const { slug } = await params;
  const body = (await req.json()) as Article;
  const articles = getAllArticles();
  const idx = articles.findIndex((a) => a.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  articles[idx] = body;
  saveAllArticles(articles);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}

export async function DELETE(_req: Request, { params }: Props) {
  const { slug } = await params;
  const articles = getAllArticles();
  const filtered = articles.filter((a) => a.slug !== slug);
  if (filtered.length === articles.length) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  saveAllArticles(filtered);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
