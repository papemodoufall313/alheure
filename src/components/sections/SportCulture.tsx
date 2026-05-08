import Link from "next/link";
import { getArticlesByRubrique } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function SportCulture() {
  const sport = getArticlesByRubrique("sport").slice(0, 2);
  const culture = getArticlesByRubrique("culture").slice(0, 2);
  const cards = [...sport, ...culture];

  return (
    <section className="section">
      <div className="wrap">
        <div className="secHead">
          <div className="l">
            <span className="kicker">Terrain &amp; scène</span>
            <h2>Sport · Culture</h2>
          </div>
          <Link href="#" className="more">Tout voir</Link>
        </div>
        <div className="aluneGrid">
          {cards.map((a) => (
            <ArticleCard key={a.slug} article={a} sizes="25vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
