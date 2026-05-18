import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";
import { unstable_noStore as noStore } from "next/cache";
import ArticleImage from "@/components/ArticleImage";

type Dossier = {
  id: string;
  active: boolean;
  imgUrl: string;
  alt: string;
  label: string;
  title: string;
  dek: string;
  episode: string;
  href: string;
};

function getDossiers(): Dossier[] {
  noStore();
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "src/data/dossiers.json"), "utf-8"));
  } catch {
    return [];
  }
}

export default function Dossiers() {
  const cards = getDossiers().filter((d) => d.active);

  if (cards.length === 0) return null;

  return (
    <section className="magSection">
      <div className="wrap">
        <div className="secHead">
          <div className="l">
            <span className="kicker">Long format · Séries</span>
            <h2>Nos dossiers</h2>
          </div>
          <Link href="#" className="more">Tous les dossiers</Link>
        </div>
        <div className="magGrid">
          {cards.map((c) => (
            <article key={c.id} className="magCard">
              <div className="artImg">
                <ArticleImage
                  src={c.imgUrl}
                  alt={c.alt}
                  seed={c.id}
                  w={600} h={600}
                  fill
                  sizes="25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="magBody">
                <span className="lab">{c.label}</span>
                <h3>
                  <Link href={c.href}>{c.title}</Link>
                </h3>
                <p className="dek">{c.dek}</p>
                <span className="ep">{c.episode}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
