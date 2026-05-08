import Image from "next/image";
import Link from "next/link";
import { getAlaUne } from "@/lib/articles";

export default function AlaUne() {
  const cards = getAlaUne();

  return (
    <section className="section">
      <div className="wrap">
        <div className="aluneHead">
          <span className="aluneLab">À la une — sélection rédaction</span>
          <span className="aluneLn" aria-hidden="true" />
          <Link href="#" className="aluneLink">Voir tout →</Link>
        </div>
        <div className="aluneGrid">
          {cards.map((art) => (
            <article key={art.slug} className="art">
              <div className="artImg">
                <Image
                  src={`https://picsum.photos/seed/${art.imgSeed}/600/400`}
                  alt={art.imgAlt}
                  fill
                  sizes="25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="rub">{art.rubriqueLabel}</span>
              <h3><Link href={`/article/${art.slug}`}>{art.title}</Link></h3>
              <div className="artMeta">
                {art.badge === "live" && (
                  <span className="badge badgeLive" style={{ fontSize: 9, padding: "2px 6px" }}>DIRECT</span>
                )}
                <time dateTime={art.dateIso}>{art.date}</time>
                {art.readTime && art.badge !== "live" && (
                  <>
                    <span className="metaDot" />
                    <span>{art.readTime}</span>
                  </>
                )}
                {art.badge === "video" && (
                  <>
                    <span className="metaDot" />
                    <span className="badge badgeVideo" style={{ fontSize: 9, padding: "2px 6px" }}>Vidéo</span>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
