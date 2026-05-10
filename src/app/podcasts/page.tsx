import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import podcastsData from "@/data/podcasts.json";

const EPISODES = podcastsData;

export default function PodcastsPage() {
  return (
    <>
      <TopBar />
      <Masthead />
      <Nav />
      <main>
        <div style={{ background: "var(--blue)", padding: "48px 0 40px" }}>
          <div className="wrap">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, background: "rgba(255,255,255,.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <div style={{ font: "700 11px var(--sans)", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>À l'Heure</div>
                <h1 style={{ font: "800 32px var(--serif)", color: "#fff", margin: 0 }}>Le Podcast</h1>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,.8)", font: "400 16px var(--sans)", maxWidth: 560, margin: 0 }}>
              Chaque semaine, une heure d'analyse, de reportage et de débat sur l'actualité sénégalaise et africaine.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              {["Spotify", "Apple Podcasts", "Deezer", "RSS"].map((pl) => (
                <a key={pl} href="#" style={{ background: "rgba(255,255,255,.15)", color: "#fff", padding: "8px 16px", borderRadius: 20, font: "600 12px var(--sans)", textDecoration: "none", border: "1px solid rgba(255,255,255,.25)" }}>
                  {pl}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="wrap" style={{ padding: "48px 28px 80px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {EPISODES.map((ep, i) => (
              <article key={ep.num} style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 24, alignItems: "start", padding: "28px 0", borderBottom: "1px solid var(--rule)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                  <span style={{ font: "700 11px var(--sans)", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Ép.</span>
                  <span style={{ font: "800 28px var(--serif)", color: "var(--blue)", lineHeight: 1 }}>{ep.num}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <h2 style={{ font: "700 20px var(--serif)", color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>{ep.title}</h2>
                  <p style={{ font: "400 14px var(--sans)", color: "var(--ink-2)", margin: 0, lineHeight: 1.55 }}>{ep.desc}</p>
                  <div style={{ display: "flex", gap: 12, font: "500 12px var(--sans)", color: "var(--ink-3)", flexWrap: "wrap" }}>
                    <span>{ep.date}</span>
                    <span>·</span>
                    <span>{ep.duration}</span>
                    <span>·</span>
                    <span style={{ fontStyle: "italic" }}>{ep.guest}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--blue)", color: "#fff", border: "none", borderRadius: 20, padding: "7px 16px", font: "600 12px var(--sans)", cursor: "pointer" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                      Écouter
                    </button>
                    <button style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 20, padding: "7px 14px", font: "600 12px var(--sans)", color: "var(--ink-2)", cursor: "pointer" }}>
                      Partager
                    </button>
                  </div>
                </div>
                <div style={{ font: "700 13px var(--sans)", color: "var(--ink-3)", paddingTop: 6, whiteSpace: "nowrap" }}>
                  {ep.duration}
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button className="loadMoreBtn">Voir tous les épisodes</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
