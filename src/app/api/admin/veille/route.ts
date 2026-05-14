import { NextResponse } from "next/server";

// Sources RSS Sénégal / Afrique
const SOURCES = [
  { name: "RFI Afrique",      url: "https://www.rfi.fr/fr/rss/afrique",                    category: "afrique"   },
  { name: "RFI Sénégal",      url: "https://www.rfi.fr/fr/rss/senegal",                    category: "senegal"   },
  { name: "Le Monde Afrique", url: "https://www.lemonde.fr/afrique/rss_full.xml",           category: "afrique"   },
  { name: "Jeune Afrique",    url: "https://www.jeuneafrique.com/feed/",                    category: "afrique"   },
  { name: "APA News",         url: "https://apanews.net/feed/",                             category: "afrique"   },
  { name: "Agence Ecofin",    url: "https://www.agenceecofin.com/flux-rss",                 category: "economie"  },
  { name: "Seneweb",          url: "https://www.seneweb.com/news/rss.php",                  category: "senegal"   },
  { name: "Dakar Actu",       url: "https://www.dakaractu.com/rss.php",                     category: "senegal"   },
  { name: "Rewmi",            url: "https://www.rewmi.com/feed/",                           category: "senegal"   },
  { name: "Pressafrik",       url: "https://www.pressafrik.com/feed/",                      category: "senegal"   },
  { name: "Africa24",         url: "https://www.africa24.com/feed/",                        category: "afrique"   },
];

export interface FeedItem {
  id:       string;
  title:    string;
  excerpt:  string;
  url:      string;
  source:   string;
  category: string;
  date:     string;
  imgUrl?:  string;
}

// Cache en mémoire : 20 minutes
const cache: { ts: number; items: FeedItem[] } = { ts: 0, items: [] };
const CACHE_TTL = 20 * 60 * 1000;

function parseRSS(xml: string, source: { name: string; category: string }): FeedItem[] {
  const items: FeedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;

  const text = (tag: string, str: string) => {
    const r = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`);
    const t = r.exec(str);
    return (t?.[1] ?? t?.[2] ?? "").trim();
  };

  const attr = (tag: string, at: string, str: string) => {
    const r = new RegExp(`<${tag}[^>]*${at}="([^"]*)"`, "i");
    return r.exec(str)?.[1] ?? "";
  };

  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const title   = text("title",       block);
    const link    = text("link",        block) || attr("link", "href", block);
    const desc    = text("description", block).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const pubDate = text("pubDate",     block);
    const imgUrl  = attr("enclosure", "url", block) ||
                    (/<img[^>]+src="([^"]+)"/i.exec(block)?.[1] ?? "");

    if (!title || !link) continue;

    const excerpt = desc.length > 300 ? desc.slice(0, 300) + "…" : desc;
    const date    = pubDate ? new Date(pubDate).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    }) : "";

    items.push({
      id:       Buffer.from(link).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 32),
      title,
      excerpt,
      url:      link,
      source:   source.name,
      category: source.category,
      date,
      imgUrl:   imgUrl || undefined,
    });
  }
  return items;
}

async function fetchSource(src: typeof SOURCES[0]): Promise<FeedItem[]> {
  try {
    const res = await fetch(src.url, {
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "AlHeureBot/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml, src);
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const force = searchParams.get("refresh") === "1";

  if (!force && Date.now() - cache.ts < CACHE_TTL && cache.items.length > 0) {
    return NextResponse.json({ items: cache.items, cached: true, ts: cache.ts });
  }

  const results = await Promise.allSettled(SOURCES.map(fetchSource));
  const items: FeedItem[] = [];
  results.forEach((r) => {
    if (r.status === "fulfilled") items.push(...r.value);
  });

  // Tri par date décroissante (best effort)
  items.sort((a, b) => (b.date > a.date ? 1 : -1));

  cache.ts    = Date.now();
  cache.items = items;

  return NextResponse.json({ items, cached: false, ts: cache.ts });
}
