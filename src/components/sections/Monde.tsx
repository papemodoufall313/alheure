import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByRubrique } from "@/lib/articles";

export default function Monde() {
  const articles = getArticlesByRubrique("monde").slice(0, 3);
  if (!articles.length) return null;

  return (
    <section className="section">
      <div className="wrap">
        <div className="secHead">
          <div className="l">
            <span className="kicker">Monde</span>
            <h2>International</h2>
          </div>
          <Link href="/rubrique/monde" className="more">Tout voir</Link>
        </div>
        <div className="mondeGrid">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} sizes="(max-width: 680px) 100vw, 33vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
