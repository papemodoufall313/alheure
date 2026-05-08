import Image from "next/image";
import Link from "next/link";
import { getFeaturedArticle, ARTICLES } from "@/lib/articles";

const SIDE_SLUGS = [
  "diomaye-2026-jeunes",
  "gaz-gta-phase-2",
  "marseille-senegalais-legislatives",
];

export default function Hero() {
  const lead = getFeaturedArticle();
  const side = SIDE_SLUGS.map((s) => ARTICLES.find((a) => a.slug === s)!).filter(Boolean);

  return (
    <section className="hero">
      <div className="wrap">
        <div className="heroGrid">

          <article className="art artLead">
            <div className="artImg" style={{ aspectRatio: "16/9" }}>
              <Image
                src={`https://picsum.photos/seed/${lead.imgSeed}/1280/720`}
                alt={lead.imgAlt}
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
            {side.map((art) => (
              <article key={art.slug} className="art">
                {art.imgSeed && (
                  <div className="artImg" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={`https://picsum.photos/seed/${art.imgSeed}/640/360`}
                      alt={art.imgAlt}
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
