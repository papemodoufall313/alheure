import Link from "next/link";

const OTHERS = [
  { num: "01", title: "Souveraineté monétaire : pourquoi l'éco se fait attendre", author: "Carlos Lopes · Économie" },
  { num: "02", title: "Justice et opinion : les paradoxes d'une réforme", author: "Ndèye Fatou Kane · Société" },
  { num: "03", title: "Le Sahel ne se résume pas au djihadisme", author: "Bakary Sambe · Géopolitique" },
  { num: "04", title: "Pourquoi la diaspora doit voter — vraiment", author: "Rama Yade · Politique" },
  { num: "05", title: "L'art contemporain africain n'est pas une mode", author: "Aïcha Diallo · Culture" },
];

export default function Tribune() {
  return (
    <section className="tribuneSection">
      <div className="wrap">
        <div className="secHead">
          <div className="l">
            <span className="kicker">Idées · Tribunes</span>
            <h2>Débats</h2>
          </div>
          <Link href="#" className="more">Toutes les tribunes</Link>
        </div>
        <div className="tribuneGrid">
          <div>
            <blockquote>
              « L&apos;Afrique n&apos;a pas besoin d&apos;un nouveau modèle. Elle a besoin de croire
              en celui qu&apos;elle est en train d&apos;inventer. »
            </blockquote>
            <cite>
              <span className="tribuneAv" aria-hidden="true">FS</span>
              <span className="tribuneWho">
                <b>Felwine Sarr</b>
                <span>Économiste, écrivain · Tribune libre</span>
              </span>
            </cite>
          </div>
          <div className="tribuneRight">
            <span className="lab">À lire aussi</span>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              Cinq plumes pour comprendre le Sénégal d&apos;aujourd&apos;hui
            </h3>
            <nav className="tribuneOthers">
              {OTHERS.map((o) => (
                <Link key={o.num} href="#">
                  <span className="tribuneNum" aria-hidden="true">{o.num}</span>
                  <div>
                    <div className="tribuneTi">{o.title}</div>
                    <div className="tribuneAu">{o.author}</div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
