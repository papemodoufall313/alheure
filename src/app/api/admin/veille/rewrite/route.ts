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
  if (!title) return NextResponse.json({ error: "Titre manquant." }, { status: 400 });

  const client = new Anthropic({ apiKey });
  const rubLabel = RUBRIQUE_LABELS[rubrique] ?? rubrique ?? "Actualité";

  const prompt = `Tu es journaliste pour « À l'Heure », quotidien sénégalais d'information (alheure.info).
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

Règles typographiques strictes — à respecter impérativement :
- Guillemets français : « texte » (espace insécable à l'intérieur), jamais "texte"
- Tiret long : — (em dash U+2014), JAMAIS -- ni -
- Points de suspension : … (caractère unique U+2026), jamais ...
- Espace insécable (U+00A0) avant : !, ?, :, ;, »
- Nombres : séparateur de milliers = espace insécable (ex : 2 500 000 F CFA)
- Pas de double ponctuation (!!, ??, ….)
- Abréviations courantes : M. (Monsieur), Mme (Madame), Dr, Pr

Autres consignes :
- Reformule complètement, n'utilise pas les formulations exactes de la source
- Ajoute du contexte et de l'historique pertinents
- Précise quand une information est à vérifier : [À confirmer]
- N'invente pas de citations ni de chiffres non mentionnés dans la source
- Écris en français standard`;

  try {
    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 1400,
      messages:   [{ role: "user", content: prompt }],
    });

    const raw = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    // Nettoyage typographique post-génération
    const clean = (s: string) => s
      .replace(/--+/g, "—")                         // -- → —
      .replace(/\.{2,}/g, "…")                      // ... → …
      .replace(/«\s*/g, "« ").replace(/\s*»/g, " »")  // espaces insécables guillemets
      .replace(/\s([!?;:])/g, " $1")                // espace insécable avant !?;:
      .replace(/\*\*/g, "");                             // enlève le markdown gras résiduel

    // Parser la réponse : extraire titre, dek, corps
    const lines     = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    const titleLine = lines.find((l) => l.startsWith("**") && l.endsWith("**"));
    const cleanTitle = clean(titleLine ? titleLine.replace(/\*\*/g, "") : title);

    const afterTitle = lines.filter((l) => l !== titleLine);
    const dek  = clean(afterTitle[0] ?? "");
    const body = clean(afterTitle.slice(1).join("\n\n"));

    return NextResponse.json({ title: cleanTitle, dek, body, raw });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur API Claude";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
