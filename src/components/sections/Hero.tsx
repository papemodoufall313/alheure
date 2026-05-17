import Link from "next/link";
import Image from "next/image";
import { readFileSync } from "fs";
import { join } from "path";
import { unstable_noStore as noStore } from "next/cache";
import { getFeaturedArticle, getArticleBySlug } from "@/lib/articles";
import { artImgSrc } from "@/lib/imgSrc";
import ArticleImage from "@/components/ArticleImage";

const SIDE_SLUGS = [
  "diomaye-2026-jeunes",
  "gaz-gta-phase-2",
  "marseille-senegalais-legislatives",
];

function getUne() {
  noStore();
  try { return JSON.parse(readFileSync(join(process.cwd(), "src/data/une.json"), "utf-8")); }
  catch { return { imgUrl: "", date: "", numero: "", headline: "", active: false }; }
}

export default function Hero() {
  const lead = getFeaturedArticle();
  const side = SIDE_SLUGS.map((s) => getArticleBySlug(s)!).filter(Boolean);
  const une  = getUne();
  const showUne = une.active && une.imgUrl;

  return (
    <section className="hero">
      <div className="wrap">
        <div className="heroGrid">

          <article className="art artLead">
            <div className="artImg" style={{ aspectRatio: "16/9" }}>
              <ArticleImage
                src={artImgSrc(lead.imgSeed, lead.imgUrl, 1280, 720)}
                alt={lead.imgAlt}
                seed={lead.imgSeed}
                w={1280} h={720}
                fill
                sizes="(max-width: 768px) 100vw, 65vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <span className="artCred">Photo · Mamadou Diop / À l&apos;Heure</span>
            </div>
            {lead.badge === "rep" && <span className="badge badgeRep">Grand reportage</span>}
            <span className="rub">{lead.rubriqueLabel}</span>
            <h3>
              <Link href={`/article/${lead.slug}`}>{lead.title}</Link>
            </h3>
            <p className="dek">{lead.dek}</p>
            <div className="artMeta">
              <span className="by">{lead.author}</span>
              <span className="metaDot" />
              <time dateTime={lead.dateIso}>{lead.date}</time>
              <span className="metaDot" />
              <span>Lecture {lead.readTime}</span>
              <span className="metaDot" />
              <span style={{ color: "var(--red)", fontWeight: 700 }}>● 6 commentaires</span>
            </div>
          </article>

          <aside className="heroSide" aria-label="Autres titres">

            {/* Une papier en tête du sidebar */}
            {showUne && (
              <div className="uneWidget">
                <div className="uneWidgetLabel">
                  <span className="kicker" style={{ fontSize: 10 }}>Édition papier</span>
                  {une.date && <span style={{ font: "400 10px var(--sans)", color: "var(--ink-3)" }}>{une.numero ? `N°${une.numero} · ` : ""}{une.date}</span>}
                </div>
                <div className="uneWidgetBody">
                  <a href={une.imgUrl} target="_blank" rel="noopener noreferrer" className="uneWidgetCover">
                    <Image src={une.imgUrl} alt={`Une du journal — ${une.date}`} width={110} height={156} style={{ display: "block", width: "100%", height: "auto", borderRadius: 2 }} unoptimized />
                  </a>
                  <div style={{ flex: 1 }}>
                    {une.headline && <p style={{ font: "700 13px/1.3 var(--serif)", color: "var(--ink)", margin: "0 0 8px" }}>{une.headline}</p>}
                    <p style={{ font: "400 11px var(--sans)", color: "var(--ink-2)", lineHeight: 1.5, margin: "0 0 10px" }}>Retrouvez l&apos;édition du jour dans les kiosques de Dakar.</p>
                    <Link href="/newsletter" style={{ font: "700 10px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--blue)", textDecoration: "none" }}>S&apos;abonner →</Link>
                  </div>
                </div>
              </div>
            )}

            {side.map((art) => (
              <article key={art.slug} className="art">
                {art.imgSeed && (
                  <div className="artImg" style={{ aspectRatio: "16/9" }}>
                    <ArticleImage
                      src={artImgSrc(art.imgSeed, art.imgUrl, 640, 360)}
                      alt={art.imgAlt}
                      seed={art.imgSeed}
                      w={640} h={360}
                      fill
                      sizes="30vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <span className="rub">{art.rubriqueLabel}</span>
                <h3><Link href={`/article/${art.slug}`}>{art.title}</Link></h3>
                <p className="dek">{art.dek}</p>
                <div className="artMeta">
                  <span className="by">{art.author}</span>
                  <span className="metaDot" />
                  <time dateTime={art.dateIso}>{art.date}</time>
                  {art.badge === "video" && (
                    <>
                      <span className="metaDot" />
                      <span className="badge badgeVideo" style={{ fontSize: 9, padding: "2px 6px" }}>Vidéo</span>
                    </>
                  )}
                </div>
              </article>
            ))}
          </aside>

        </div>
      </div>
    </section>
  );
}
