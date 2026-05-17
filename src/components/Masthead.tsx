import Link from "next/link";

export default function Masthead() {
  return (
    <header className="masthead">
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" aria-label="À l'Heure — accueil" style={{ textDecoration: "none" }}>
          <svg viewBox="0 0 280 90" width="224" height="72" xmlns="http://www.w3.org/2000/svg">
            {/* Arc rouge horloge */}
            <path d="M 105 54 A 38 38 0 0 1 181 54" fill="none" stroke="#C8302A" strokeWidth="5" strokeLinecap="round"/>
            {/* Aiguille minute (12h) */}
            <line x1="143" y1="54" x2="143" y2="22" stroke="#0E2B62" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Aiguille heure (2h) */}
            <line x1="143" y1="54" x2="163" y2="40" stroke="#0E2B62" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Centre */}
            <circle cx="143" cy="54" r="3" fill="#0E2B62"/>
            {/* Texte "A l'heure" */}
            <text x="6" y="78" fontFamily="Georgia,'Times New Roman',serif" fontWeight="700" fontSize="44" fill="#0E2B62" fontStyle="italic" letterSpacing="-1">A l&apos;heure</text>
            {/* Barre rouge sous le texte */}
            <rect x="6" y="83" width="268" height="4" fill="#C8302A" rx="1"/>
          </svg>
        </Link>

        <div className="mastRight">
          <span className="updated" style={{ fontSize: 12 }}>Mis à jour il y a 4&nbsp;min</span>
          <Link href="/recherche" className="iconBtn" aria-label="Rechercher">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="tricolor" aria-hidden="true">
        <span /><span /><span />
      </div>
    </header>
  );
}
