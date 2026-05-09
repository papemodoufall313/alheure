import Link from "next/link";
import { getArticlesByRubrique } from "@/lib/articles";
import { artImgSrc } from "@/lib/imgSrc";
import ArticleImage from "@/components/ArticleImage";
import Sidebar from "@/components/Sidebar";
import ArticleCard from "@/components/ArticleCard";

export default function Afrique() {
  const articles = getArticlesByRubrique("afrique");
  const [lead, ...rest] = articles;
  const col1 = rest.slice(0, 2);
  const col2 = rest.slice(2, 4);

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
            <div className="three">
              <article className="art">
                <div className="artImg" style={{ aspectRatio: "16/10" }}>
                  <ArticleImage
                    src={artImgSrc(lead.imgSeed, lead.imgUrl, 900, 560)}
                    alt={lead.imgAlt}
                    seed={lead.imgSeed}
                    w={900} h={560}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
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

              <div className="colList">
                {col1.map((a) => (
                  <ArticleCard key={a.slug} article={a} variant="row" sizes="130px" />
                ))}
              </div>

              {col2.length > 0 && (
                <div className="colList">
                  {col2.map((a) => (
                    <ArticleCard key={a.slug} article={a} variant="row" sizes="130px" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <Sidebar />
        </div>
      </div>
    </section>
  );
}
