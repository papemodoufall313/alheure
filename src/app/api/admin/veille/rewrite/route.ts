import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const RUBRIQUE_LABELS: Record<string, string> = {
  senegal:   "Sénégal",
  afrique:   "Afrique",
  monde:     "Monde",
  politique: "Politique",
  economie:  "Économie",
  societe:   "Société",
  sport:     "Sport",
  culture:   "Culture",
  diaspora:  "Diaspora",
};

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY manquant dans .env.local" },
      { status: 400 }
    );
  }

  const { title, excerpt, url, rubrique } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Titre manquant." }, { status: 400 });

  const client = new Anthropic({ apiKey });
  const rubLabel = RUBRIQUE_LABELS[rubrique] ?? rubrique ?? "Actualité";

  const prompt = `Tu es journaliste pour «À l'Heure», quotidien sénégalais d'information (alheure.info).
Ton style : précis, direct, sans jargon, ancré dans la réalité sénégalaise et africaine.

À partir des informations suivantes, rédige un article journalistique complet pour la rubrique **${rubLabel}** :

TITRE SOURCE : ${title}
RÉSUMÉ SOURCE : ${excerpt || "(pas d'extrait disponible)"}
URL SOURCE : ${url || ""}

Produis :
1. Un **titre accrocheur** (max 12 mots) — en gras
2. Un **chapeau** (dek) de 1-2 phrases synthétisant l'essentiel
3. Un **corps d'article** de 4 à 6 paragraphes : faits, contexte historique, enjeux pour le Sénégal/l'Afrique, éléments de comparaison ou d'analyse
4. Une **phrase de clôture** ouvrant sur la suite

Important :
- Reformule complètement, n'utilise pas les formulations exactes de la source
- Ajoute du contexte et de l'historique pertinents
- Précise quand une information est à vérifier : [À confirmer]
- N'invente pas de citations ni de chiffres non mentionnés dans la source
- Écris en français standard`;

  if (!prompt.trim()) {
    return NextResponse.json({ error: "Impossible de générer un prompt valide." }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 1200,
      messages:   [{ role: "user", content: [{ type: "text", text: prompt }] }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    // Parser la réponse : extraire titre, dek, corps
    const lines  = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const titleLine = lines.find((l) => l.startsWith("**") && l.endsWith("**"));
    const cleanTitle = titleLine ? titleLine.replace(/\*\*/g, "") : title;

    // Dek = première phrase après le titre (pas de **...)
    const afterTitle = lines.filter((l) => l !== titleLine);
    const dek   = afterTitle[0]?.replace(/\*\*/g, "") ?? "";
    const body  = afterTitle.slice(1).join("\n\n");

    return NextResponse.json({ title: cleanTitle, dek, body, raw: text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur API Claude";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
