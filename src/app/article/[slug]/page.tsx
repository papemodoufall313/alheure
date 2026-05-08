import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import ReadingProgress from "@/components/ReadingProgress";
import { TopLus, WolofCard, NewsletterCard } from "@/components/Sidebar";
import { getArticleBySlug, getArticlesByRubrique, ARTICLES } from "@/lib/articles";
import type { ContentBlock } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.dek,
  };
}

function ProseBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "blockquote":
      return (
        <blockquote>
          {block.text}
          {block.cite && <cite>— {block.cite}</cite>}
        </blockquote>
      );
    case "pullquote":
      return <div className="pullQuote">{block.text}</div>;
    default:
      return <p>{block.text}</p>;
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getArticlesByRubrique(article.rubrique)
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  const breadcrumb = article.rubriqueLabel.split(" · ");

  return (
    <>
      <ReadingProgress />
      <TopBar />
      <Masthead />
      <Nav activeRubrique={breadcrumb[0]} />

      <main>
        <div className="artWrap">
          <div className="artLayout">

            {/* ── ARTICLE BODY ── */}
            <article className="artBody">
              {/* Breadcrumb */}
              <div className="artKicker">
                {breadcrumb.map((crumb, i) => (
                  <span key={crumb} style={{ display: "contents" }}>
                    {i > 0 && <span className="artKickerSep">/</span>}
                    <Link href={i === 0 ? `/rubrique/${article.rubrique}` : "#"}>
                      {crumb}
                    </Link>
                  </span>
                ))}
              </div>

              <h1 className="artH1">{article.title}</h1>
              <p className="artDek">{article.dek}</p>

              {/* Byline */}
              <div className="byline">
                <span className="bylineAv" aria-hidden="true">
                  {article.author.slice(0, 2).toUpperCase()}
                </span>
                <div className="bylineInfo">
                  <strong>{article.author}</strong>
                  <span>
                    {article.rubriqueLabel} · {article.date}
                    {article.readTime && ` · ${article.readTime} de lecture`}
                  </span>
                </div>
                <div className="bylineShare">
                  <button aria-label="Partager sur Facebook">f</button>
                  <button aria-label="Partager sur X">𝕏</button>
                  <button aria-label="Partager par WhatsApp">✉</button>
                  <button aria-label="Copier le lien">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Hero image */}
              <figure className="artHero">
                <div className="artHeroImg">
                  <Image
                    src={`https://picsum.photos/seed/${article.imgSeed}/1280/720`}
                    alt={article.imgAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 65vw"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
                <figcaption className="artCaption">
                  {article.imgAlt} — Photo : {article.author.split(",")[0]} / À l&apos;Heure
                </figcaption>
              </figure>

              {/* Badges */}
              <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                {article.badge === "rep" && (
                  <span className="badge badgeRep" style={{ fontSize: 10, padding: "4px 10px" }}>Grand reportage</span>
                )}
                {article.badge === "longformat" && (
                  <span className="badge" style={{ fontSize: 10, padding: "4px 10px", background: "var(--gold)" }}>Long format</span>
                )}
                {article.badge === "video" && (
                  <span className="badge badgeVideo" style={{ fontSize: 10, padding: "4px 10px" }}>Vidéo</span>
                )}
                <span className="badge" style={{ fontSize: 10, padding: "4px 10px" }}>{article.rubriqueLabel.split(" · ")[0]}</span>
              </div>

              {/* Body prose */}
              {article.body ? (
                <div className="prose">
                  {article.body.map((block, i) => (
                    <ProseBlock key={i} block={block} />
                  ))}
                </div>
              ) : (
                <div className="prose">
                  <p className="dropCap">{article.dek}</p>
                  <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                    Le contenu complet de cet article est disponible pour les abonnés.
                  </p>
                </div>
              )}

              {/* Tags */}
              {article.tags && (
                <div className="artTags">
                  {article.tags.map((tag) => (
                    <a key={tag} href={`/recherche?q=${encodeURIComponent(tag)}`}>{tag}</a>
                  ))}
                </div>
              )}

              {/* Author bio */}
              {article.authorBio && (
                <div className="artAuthor">
                  <span className="bylineAv" aria-hidden="true">
                    {article.author.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <strong style={{ font: "700 14px var(--sans)", color: "var(--ink)", display: "block", marginBottom: 4 }}>
                      {article.author.split(",")[0]}
                    </strong>
                    <p style={{ font: "400 13px var(--sans)", color: "var(--ink-3)", margin: 0, lineHeight: 1.5 }}>
                      {article.authorBio}
                    </p>
                  </div>
                </div>
              )}

              {/* Comments CTA */}
              <div className="commentsCta">
                <div className="commentsCount">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {article.commentCount ?? 0} commentaire{(article.commentCount ?? 0) !== 1 ? "s" : ""}
                </div>
                <button>Participer à la discussion</button>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <section className="related" aria-labelledby="related-heading">
                  <div className="relatedHead">
                    <span className="kicker">À lire aussi</span>
                    <h2 id="related-heading" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 26, fontWeight: 700, color: "var(--blue)", margin: 0 }}>
                      Sur le même sujet
                    </h2>
                  </div>
                  <div className="relatedGrid">
                    {related.map((a) => (
                      <ArticleCard key={a.slug} article={a} sizes="(max-width: 768px) 100vw, 20vw" />
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* ── SIDEBAR ── */}
            <aside className="sideStack" style={{ position: "sticky", top: 78 }}>
              {/* Audio teaser */}
              <div style={{ background: "var(--blue-deep)", color: "#e7ecf6", padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ font: "800 10px var(--sans)", letterSpacing: ".16em", textTransform: "uppercase", color: "#f0c8c5" }}>
                  ▶ Écouter cet article
                </span>
                <span style={{ fontFamily: "var(--serif)", fontSize: 16, color: "#fff", fontWeight: 600 }}>
                  Lecture audio · {article.readTime}
                </span>
                <span style={{ font: "500 11px var(--sans)", color: "#a8b4cf" }}>Narration : Awa Sané</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                  <button className="podPlay" style={{ width: 40, height: 40, background: "var(--red)", border: 0, borderRadius: "50%", color: "#fff", flexShrink: 0 }} aria-label="Lire l'audio" />
                  <div className="wave" aria-hidden="true" style={{ height: 30 }}>
                    {[4,8,14,10,18,12,20,14,10,16,8,12,18,10,6,14,20,12,8,16].map((h, i) => (
                      <i key={i} style={{ height: h }} />
                    ))}
                  </div>
                </div>
              </div>
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
