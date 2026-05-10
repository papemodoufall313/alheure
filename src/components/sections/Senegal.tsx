import Link from "next/link";
import { getArticlesByRubrique } from "@/lib/articles";
import { artImgSrc } from "@/lib/imgSrc";
import ArticleImage from "@/components/ArticleImage";
import ArticleCard from "@/components/ArticleCard";

export default function Senegal() {
  const articles = getArticlesByRubrique("senegal").filter((a) => !a.featured);
  const [lead, ...rest] = articles;
  const list = rest.slice(0, 4);

  if (!lead) return null;

  return (
    <section className="snSection">
      <div className="wrap">
        <div className="secHead">
          <div className="l">
            <span className="kicker">Notre pays</span>
            <h2>Sénégal</h2>
          </div>
          <Link href="/rubrique/senegal" className="more">Toute l&apos;actualité du Sénégal</Link>
        </div>

        <div className="snGrid">
          <article className="art artMedium">
            <div className="artImg" style={{ aspectRatio: "3/2" }}>
              <ArticleImage
                src={artImgSrc(lead.imgSeed, lead.imgUrl, 900, 600)}
                alt={lead.imgAlt}
                seed={lead.imgSeed}
                w={900} h={600}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <span className="rub">{lead.rubriqueLabel}</span>
            <h3 style={{ fontSize: 34, lineHeight: 1.08 }}>
              <Link href={`/article/${lead.slug}`}>{lead.title}</Link>
            </h3>
            <p className="dek" style={{ fontSize: 15 }}>{lead.dek}</p>
            <div className="artMeta">
              <span className="by">{lead.author}</span>
              <span className="metaDot" />
              <time dateTime={lead.dateIso}>{lead.date}</time>
              {lead.readTime && (
                <>
                  <span className="metaDot" />
                  <span>{lead.readTime}</span>
                </>
              )}
              {lead.badge === "longformat" && (
                <>
                  <span className="metaDot" />
                  <span style={{ fontWeight: 700, color: "var(--blue)" }}>Long format</span>
                </>
              )}
            </div>
          </article>

          <div className="snList">
            {list.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="row" sizes="130px" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
