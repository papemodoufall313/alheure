import Link from "next/link";
import { getArticlesByRubrique } from "@/lib/articles";
import { artImgSrc } from "@/lib/imgSrc";
import ArticleImage from "@/components/ArticleImage";
import Sidebar from "@/components/Sidebar";

export default function Afrique() {
  const articles = getArticlesByRubrique("afrique");
  const [lead, ...rest] = articles;
  const secondary = rest.slice(0, 4);

  if (!lead) return null;

  return (
    <section className="section">
      <div className="wrap">
        <div className="sbGrid">
          <div>
            <div className="secHead">
              <div className="l">
                <span className="kicker">Continent</span>
                <h2>Afrique</h2>
              </div>
              <Link href="/rubrique/afrique" className="more">Tout l&apos;agenda africain</Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 32, alignItems: "start" }}>
              {/* Article lead */}
              <article className="art">
                <div className="artImg" style={{ aspectRatio: "16/10" }}>
                  <ArticleImage
                    src={artImgSrc(lead.imgSeed, lead.imgUrl, 900, 560)}
                    alt={lead.imgAlt}
                    seed={lead.imgSeed}
                    w={900} h={560}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <span className="rub">{lead.rubriqueLabel}</span>
                <h3 style={{ fontSize: 28 }}>
                  <Link href={`/article/${lead.slug}`}>{lead.title}</Link>
                </h3>
                <p className="dek">{lead.dek}</p>
                <div className="artMeta">
                  <span className="by">{lead.author}</span>
                  <span className="metaDot" />
                  <time dateTime={lead.dateIso}>{lead.date}</time>
                </div>
              </article>

              {/* Liste compacte des autres articles */}
              <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid var(--rule)", paddingLeft: 24 }}>
                {secondary.map((a, i) => {
                  const shortDate = a.dateIso
                    ? new Date(a.dateIso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                    : a.date;
                  return (
                    <div key={a.slug} style={{
                      paddingBottom: 16, marginBottom: 16,
                      borderBottom: i < secondary.length - 1 ? "1px solid var(--rule-2)" : "none"
                    }}>
                      <span className="rub">{a.rubriqueLabel}</span>
                      <h4 style={{ font: "700 16px/1.3 var(--serif)", margin: "5px 0 8px", color: "var(--ink)" }}>
                        <Link href={`/article/${a.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {a.title}
                        </Link>
                      </h4>
                      <div className="artMeta">
                        <span className="by">{a.author}</span>
                        <span className="metaDot" />
                        <time dateTime={a.dateIso}>{shortDate}</time>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Sidebar />
        </div>
      </div>
    </section>
  );
}
