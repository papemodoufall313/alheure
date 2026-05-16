export default function TopBar() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const dateLabel = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="topbar">
      <div className="wrap">
        <div className="left">
          <span>
            {dateLabel} ·{" "}
            <em style={{ fontStyle: "normal", color: "#fff" }}>Dakar</em>
          </span>
          <span className="topbarDot" />
          <span className="meteo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd24d" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
            </svg>
            Dakar 28°C · ciel clair
          </span>
          <span className="topbarDot" />
          <span>Marée haute 14h12</span>
        </div>
        <div className="right">
          <a href="#">Newsletter</a>
          <a href="#">Apps</a>
          <span className="topbarDot" />
          <div className="lang" role="tablist" aria-label="Langue">
            <button className="on" role="tab">FR</button>
            <button role="tab">EN</button>
            <button role="tab">WO</button>
          </div>
        </div>
      </div>
    </div>
  );
}
