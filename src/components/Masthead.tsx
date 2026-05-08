import Link from "next/link";

export default function Masthead() {
  return (
    <header className="masthead">
      <div className="wrap">
        <div className="mastLeft">
          <button className="liveBtn" aria-label="En direct — Journal de 13h">
            <span className="pulse" aria-hidden="true" />
            DIRECT <small>· Journal de 13h</small>
          </button>
          <span className="updated">Mis à jour il y a 4&nbsp;min</span>
        </div>

        <Link className="logo" href="/" aria-label="À l'Heure — accueil">
          <span className="logoMark">
            <span className="a">À</span> l&apos;Heure
          </span>
          <span className="logoTag">
            L&apos;information
            <br />
            du Sénégal et
            <br />
            de l&apos;Afrique
          </span>
        </Link>

        <div className="mastRight">
          <button className="iconBtn" aria-label="Rechercher">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
          <button className="iconBtn" aria-label="Mon compte">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
          </button>
          <button className="subBtn">S&apos;ABONNER</button>
        </div>
      </div>
      <div className="tricolor" aria-hidden="true">
        <span /><span /><span />
      </div>
    </header>
  );
}
