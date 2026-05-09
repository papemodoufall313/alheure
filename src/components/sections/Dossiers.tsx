import Link from "next/link";
import ArticleImage from "@/components/ArticleImage";

const CARDS = [
  {
    seed: "dossier-petrole",
    imgUrl: "https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Pétrole et gaz au Sénégal",
    lab: "Série · 6 épisodes",
    title: "Pétrole et gaz : la promesse, le doute, la rente",
    dek: "Six mois d'enquête au cœur des plateformes off-shore. Comment Sangomar et GTA changent — ou non — la vie des Sénégalais.",
    ep: "Épisode 4 · « À qui profite la manne ? »",
  },
  {
    seed: "dossier-migrations",
    imgUrl: "https://images.pexels.com/photos/1374610/pexels-photo-1374610.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Migration, pirogues en mer",
    lab: "Long format",
    title: "Barça wala Barzakh : ces jeunes qui choisissent encore la pirogue",
    dek: "À Mbour, Saint-Louis et Kafountine, la rédaction a suivi pendant huit semaines des familles partagées entre l'espoir et le deuil.",
    ep: "Reportage · 22 min de lecture",
  },
];

export default function Dossiers() {
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
          {CARDS.map((c) => (
            <article key={c.title} className="magCard">
              <div className="artImg">
                <ArticleImage
                  src={c.imgUrl}
                  alt={c.alt}
                  seed={c.seed}
                  w={600} h={600}
                  fill
                  sizes="25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="magBody">
                <span className="lab">{c.lab}</span>
                <h3>{c.title}</h3>
                <p className="dek">{c.dek}</p>
                <span className="ep">{c.ep}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
