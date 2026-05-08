import Link from "next/link";

const COLS = [
  {
    title: "Rubriques",
    links: ["Sénégal", "Afrique", "Monde", "Politique", "Économie"],
  },
  {
    title: "Magazines",
    links: ["Sport · Lions", "Culture · Téranga", "Diaspora", "Idées · Débats", "Sciences"],
  },
  {
    title: "Antenne",
    links: ["Direct radio", "Programmes", "Podcasts", "Vidéos", "Fréquences"],
  },
  {
    title: "La rédaction",
    links: ["Qui sommes-nous", "Charte éditoriale", "Nous contacter", "Carrières", "Annonceurs"],
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="ftTop">
          <div className="ftBrand">
            <Link href="/" className="lg" aria-label="À l'Heure — accueil">
              <span className="a">À</span> l&apos;Heure
            </Link>
            <p>
              Quotidien d&apos;information indépendant. Sénégal — Afrique — Monde.
              <br />
              Édité depuis Dakar, en français, anglais et wolof.
            </p>
            <div className="ftSocials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="X / Twitter">𝕏</a>
              <a href="#" aria-label="Instagram">◐</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="WhatsApp">✉</a>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h5>{col.title}</h5>
              <ul>
                {col.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ftBot">
          <span>© 2026 À l&apos;Heure SA · Dakar, Sénégal · RC SN-DKR-2018-B-1042</span>
          <div className="links">
            <a href="#">Mentions légales</a>
            <a href="#">CGU</a>
            <a href="#">Cookies</a>
            <a href="#">Plan du site</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
