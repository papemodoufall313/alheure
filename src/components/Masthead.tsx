import Link from "next/link";
import Image from "next/image";

export default function Masthead() {
  return (
    <header className="masthead">
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" aria-label="À l'Heure — accueil" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/logo.png"
            alt="À l'Heure"
            width={220}
            height={80}
            priority
            style={{ height: 64, width: "auto", objectFit: "contain" }}
            unoptimized
          />
        </Link>

        <div className="mastRight">
          <span className="updated" style={{ fontSize: 12 }}>Mis à jour il y a 4 min</span>
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
