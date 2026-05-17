import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";

const client = new Anthropic();

type Article = {
  slug: string;
  title: string;
  dek?: string;
  rubriqueLabel?: string;
  rubrique?: string;
  date?: string;
  dateIso?: string;
  author?: string;
  readTime?: string;
};

type TickerItem = {
  id: string;
  time: string;
  text: string;
  active: boolean;
};

type Une = {
  imgUrl?: string;
  date?: string;
  numero?: string;
  headline?: string;
  active: boolean;
};

function getSiteContext(): string {
  let une: Une | null = null;
  try {
    une = JSON.parse(readFileSync(join(process.cwd(), "src/data/une.json"), "utf-8"));
  } catch {}

  let articles: Article[] = [];
  try {
    articles = JSON.parse(readFileSync(join(process.cwd(), "src/data/articles.json"), "utf-8"));
  } catch {}

  let ticker: TickerItem[] = [];
  try {
    ticker = (JSON.parse(readFileSync(join(process.cwd(), "src/data/ticker.json"), "utf-8")) as TickerItem[]).filter(i => i.active);
  } catch {}

  const parts: string[] = [];

  if (une?.active && une.headline) {
    parts.push(`=== UNE PAPIER DU JOUR ===
Numéro : ${une.numero || "N/A"}
Date : ${une.date || "Aujourd'hui"}
Titre principal : ${une.headline}`);
  } else {
    parts.push("=== UNE PAPIER : Non disponible aujourd'hui ===");
  }

  if (ticker.length > 0) {
    parts.push(`=== FLASH INFO EN CONTINU ===
${ticker.map(t => `• ${t.text}`).join("\n")}`);
  }

  if (articles.length > 0) {
    const byRubrique: Record<string, Article[]> = {};
    for (const a of articles) {
      const r = a.rubriqueLabel || a.rubrique || "Divers";
      if (!byRubrique[r]) byRubrique[r] = [];
      byRubrique[r].push(a);
    }

    const sections = Object.entries(byRubrique)
      .slice(0, 8)
      .map(([rubrique, arts]) =>
        `${rubrique.toUpperCase()} :\n${arts.slice(0, 4).map(a =>
          `  - ${a.title}${a.dek ? ` — ${a.dek.slice(0, 80)}` : ""}${a.readTime ? ` (${a.readTime})` : ""}`
        ).join("\n")}`
      )
      .join("\n\n");

    parts.push(`=== ARTICLES SUR LE SITE ===\n${sections}`);
  }

  return parts.join("\n\n");
}

const SYSTEM_PROMPT_BASE = `Tu es ABSA (Assistant du Brief Sénégalais d'Actualité), l'assistant IA intégré au site d'information "À l'Heure" — le quotidien sénégalais d'information indépendant, édité depuis Dakar, couvrant le Sénégal, l'Afrique et le monde.

Ton rôle :
- Accueillir et aider les visiteurs du site
- Présenter la Une papier du jour et les grands titres
- Résumer et présenter les articles disponibles sur le site
- Rapporter les informations du bandeau flash info
- Répondre aux questions sur l'actualité sénégalaise et africaine couverte par À l'Heure

Règles :
- Réponds toujours en français
- Reste concis et informatif (3-5 phrases maximum sauf si on te demande un développement)
- Ne réponds qu'aux sujets couverts par le site ou liés à l'actualité sénégalaise/africaine
- Si on te pose une question hors sujet, redirige poliment vers ce que tu peux apporter
- Ne fabrique pas d'informations : si tu ne sais pas, dis-le
- Ton ton : professionnel, chaleureux, journalistique`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as { messages: { role: "user" | "assistant"; content: string }[] };

  const siteContext = getSiteContext();
  const system = `${SYSTEM_PROMPT_BASE}\n\n${siteContext}`;

  const stream = await client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 512,
    system,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const text of stream.textStream) {
          controller.enqueue(encoder.encode(text));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
