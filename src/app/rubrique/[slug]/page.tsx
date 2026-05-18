import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import ArticleImage from "@/components/ArticleImage";
import { TopLus, WolofCard, NewsletterCard } from "@/components/Sidebar";
import { getArticlesByRubrique } from "@/lib/articles";
import { artImgSrc } from "@/lib/imgSrc";
import { RUBRIQUES_NAV } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return RUBRIQUES_NAV.filter((r) => r.slug).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nav = RUBRIQUES_NAV.find((r) => r.slug === slug);
  if (!nav) return {};
  return { title: nav.label };
}

export default async function RubriquePage({ params }: Props) {
  const { slug } = await params;
  const nav = RUBRIQUES_NAV.find((r) => r.slug === slug);
  if (!nav) notFound();

  const articles = getArticlesByRubrique(slug);
  const [lead, ...rest] = articles;

  // kicker labels per rubrique
  const kickers: Record<string, string> = {
    senegal: "Notre pays",
    afrique: "Continent",
    monde: "International",
    politique: "Institutions",
    economie: "Marchés & entreprises",
    societe: "Vie quotidienne",
    sport: "Terrain",
    culture: "Scène & arts",
    diaspora: "Hors-frontières",
    environnement: "Planète & climat",
    sante: "Santé publique",
  };

  return (
    <>
      <TopBar />
      <Masthead />
      <Nav activeRubrique={nav.label} />

      <main>
        {/* ── Section header banner ── */}
        <div className="rubriqueHero">
          <div className="wrap">
            <div className="rubriqueHeroInner">
              <span className="kicker">{kickers[slug] ?? ""}</span>
              <h1 className="rubriqueTitle">{nav.label}</h1>
            </div>
          </div>
        </div>

        <div className="wrap" style={{ padding: "36px 28px 60px" }}>
          {articles.length === 0 ? (
            <p style={{ font: "400 15px var(--sans)", color: "var(--ink-3)", padding: "40px 0" }}>
              Aucun article dans cette rubrique pour le moment.
            </p>
          ) : null}
          <div className="sbGrid">
            <div>
              {/* Lead article — full width with large image */}
              {lead && (
                <>
                  <div className="rubrique-lead">
                    <article className="art" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "start" }}>
                      <div className="artImg" style={{ aspectRatio: "3/2" }}>
                        <ArticleImage
                          src={artImgSrc(lead.imgSeed, lead.imgUrl, 900, 600)}
                          alt={lead.imgAlt}
                          seed={lead.imgSeed}
                          w={900} h={600}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          style={{ objectFit: "cover" }}
                          priority
                        />
                        {lead.badge === "rep" && (
                          <span className="badge badgeRep" style={{ position: "absolute", top: 12, left: 12 }}>
                            Grand reportage
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
                        <span className="rub">{lead.rubriqueLabel}</span>
                        <h2 style={{ fontFamily: "var(--serif)", fontWeight: 800, fontSize: 36, lineHeight: 1.06, margin: 0, color: "var(--ink)", letterSpacing: "-.02em" }}>
                          <Link href={`/article/${lead.slug}`}>{lead.title}</Link>
                        </h2>
                        <p className="dek" style={{ fontSize: 16 }}>{lead.dek}</p>
                        <div className="artMeta">
                          <span className="by">{lead.author}</span>
                          <span className="metaDot" />
                          <time dateTime={lead.dateIso}>{lead.date}</time>
                          <span className="metaDot" />
                          <span>{lead.readTime}</span>
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 2, background: "var(--blue)", margin: "32px 0 28px" }} />

                  {/* Grid of remaining articles */}
                  {rest.length > 0 && (
                    <div className="rubriqueGrid">
                      {rest.map((art) => (
                        <ArticleCard key={art.slug} article={art} sizes="(max-width: 768px) 100vw, 22vw" />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Load more (static placeholder) */}
              {rest.length >= 4 && (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <button className="loadMoreBtn">
                    Charger plus d&apos;articles
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 6 }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="sideStack" style={{ top: 78 }}>
              <TopLus />
              <WolofCard />
              <NewsletterCard />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
