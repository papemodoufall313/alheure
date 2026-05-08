import { NextResponse } from "next/server";
import { getAllArticles, saveAllArticles } from "@/lib/articles";
import { revalidatePath } from "next/cache";
import type { Article } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getAllArticles());
}

export async function POST(req: Request) {
  const body = (await req.json()) as Article;
  const articles = getAllArticles();
  if (articles.find((a) => a.slug === body.slug)) {
    return NextResponse.json({ error: "Slug déjà utilisé" }, { status: 409 });
  }
  articles.unshift(body);
  saveAllArticles(articles);
  revalidatePath("/", "layout");
  return NextResponse.json(body, { status: 201 });
}
