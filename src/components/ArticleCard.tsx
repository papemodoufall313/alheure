import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

interface Props {
  article: Article;
  variant?: "default" | "row" | "lead";
  sizes?: string;
}

function picsumOrUrl(seed: string, url: string | undefined, w: number, h: number) {
  return url || `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export default function ArticleCard({ article: a, variant = "default", sizes = "25vw" }: Props) {
  const cls = variant === "row" ? "art artRow" : variant === "lead" ? "art artLead" : "art";

  if (variant === "row") {
    return (
      <article className={cls}>
        <div className="artImg" style={{ flex: "0 0 130px", aspectRatio: "1" }}>
          <Image
            src={picsumOrUrl(a.imgSeed, a.imgUrl, 300, 300)}
            alt={a.imgAlt}
            fill
            sizes="130px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="artBody">
          <span className="rub">{a.rubriqueLabel}</span>
          <h3><Link href={`/article/${a.slug}`}>{a.title}</Link></h3>
          <div className="artMeta">
            <time dateTime={a.dateIso}>{a.date}</time>
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

  return (
    <article className={cls}>
      <div className="artImg">
        <Image
          src={picsumOrUrl(a.imgSeed, a.imgUrl, 600, 400)}
          alt={a.imgAlt}
          fill
          sizes={sizes}
          style={{ objectFit: "cover" }}
        />
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
