import Link from "next/link";
import type { Article } from "@/lib/types";
import { artImgSrc } from "@/lib/imgSrc";
import ArticleImage from "@/components/ArticleImage";

interface Props {
  article: Article;
  variant?: "default" | "row" | "lead";
  sizes?: string;
}

export default function ArticleCard({ article: a, variant = "default", sizes = "25vw" }: Props) {
  const cls = variant === "row" ? "art artRow" : variant === "lead" ? "art artLead" : "art";

  if (variant === "row") {
    const src = artImgSrc(a.imgSeed, a.imgUrl, 300, 300);
    const shortDate = a.dateIso
      ? new Date(a.dateIso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : a.date;
    return (
      <article className={cls}>
        <div className="artImg" style={{ flex: "0 0 130px", aspectRatio: "1" }}>
          <ArticleImage src={src} alt={a.imgAlt} seed={a.imgSeed} w={300} h={300} fill sizes="130px" style={{ objectFit: "cover" }} />
        </div>
        <div className="artBody">
          <span className="rub">{a.rubriqueLabel}</span>
          <h3><Link href={`/article/${a.slug}`}>{a.title}</Link></h3>
          <div className="artMeta">
            <time dateTime={a.dateIso}>{shortDate}</time>
            {a.readTime && (
              <>
                <span className="metaDot" />
                <span>{a.readTime}</span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  const src = artImgSrc(a.imgSeed, a.imgUrl, 600, 400);
  return (
    <article className={cls}>
      <div className="artImg">
        <ArticleImage src={src} alt={a.imgAlt} seed={a.imgSeed} w={600} h={400} fill sizes={sizes} style={{ objectFit: "cover" }} />
      </div>
      {a.badge === "rep" && <span className="badge badgeRep">Grand reportage</span>}
      <span className="rub">{a.rubriqueLabel}</span>
      <h3><Link href={`/article/${a.slug}`}>{a.title}</Link></h3>
      {a.dek && <p className="dek">{a.dek}</p>}
      <div className="artMeta">
        {a.badge === "live" && (
          <span className="badge badgeLive" style={{ fontSize: 9, padding: "2px 6px" }}>DIRECT</span>
        )}
        <span className="by">{a.author}</span>
        <span className="metaDot" />
        <time dateTime={a.dateIso}>{a.date}</time>
        {a.readTime && (
          <>
            <span className="metaDot" />
            <span>{a.readTime}</span>
          </>
        )}
        {a.badge === "video" && (
          <>
            <span className="metaDot" />
            <span className="badge badgeVideo" style={{ fontSize: 9, padding: "2px 6px" }}>Vidéo</span>
          </>
        )}
        {a.badge === "longformat" && (
          <>
            <span className="metaDot" />
            <span style={{ fontWeight: 700, color: "var(--blue)" }}>Long format</span>
          </>
        )}
      </div>
    </article>
  );
}
