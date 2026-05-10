import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const VIDEOS = [
  {
    slug: "sangomar-reportage",
    title: "Sangomar : dans les coulisses de la première plateforme pétrolière sénégalaise",
    desc: "Notre équipe a embarqué à bord du navire de soutien. Images exclusives.",
    duration: "14:32",
    date: "7 mai 2026",
    category: "Grand reportage",
    thumb: "/images/gaz-gta-phase-2.jpg",
  },
  {
    slug: "lutte-arene-nationale",
    title: "Arène nationale : coulisses d'un combat entre Modou Lô et Siteu",
    desc: "Accès inédit aux vestiaires, aux marabouts et à la foule en délire.",
    duration: "22:05",
    date: "2 mai 2026",
    category: "Sport",
    thumb: "/images/lutte-modou-lo-siteu.jpg",
  },
  {
    slug: "biennale-dakar",
    title: "Dak'Art 2026 : l'art africain contemporain prend d'assaut Dakar",
    desc: "Visite guidée des expositions, rencontre avec les artistes.",
    duration: "11:18",
    date: "28 avr. 2026",
    category: "Culture",
    thumb: "/images/dakart-biennale-2026.svg",
  },
  {
    slug: "keur-massar-inondations",
    title: "Inondations à Keur Massar : les familles témoignent",
    desc: "Trois ans après les grandes inondations, les habitants attendent toujours.",
    duration: "8:47",
    date: "25 avr. 2026",
    category: "Société",
    thumb: "/images/keur-massar-inondations.jpg",
  },
  {
    slug: "lions-entrainement",
    title: "Les Lions se préparent : entraînement ouvert à la presse",
    desc: "Aliou Cissé présente son groupe avant les qualifications.",
    duration: "6:12",
    date: "20 avr. 2026",
    category: "Football",
    thumb: "/images/lions-selection-mane.jpg",
  },
  {
    slug: "diomaye-paris",
    title: "Diomaye à Paris : les images de la visite d'État",
    desc: "Deux jours d'une diplomatie intense entre Dakar et l'Élysée.",
    duration: "9:30",
    date: "15 avr. 2026",
    category: "Politique",
    thumb: "/images/diomaye-paris-agenda.jpg",
  },
];

export default function VideosPage() {
  const [featured, ...rest] = VIDEOS;

  return (
    <>
      <TopBar />
      <Masthead />
      <Nav />
      <main>
        <div className="wrap" style={{ padding: "36px 28px 80px" }}>
          <div style={{ borderBottom: "3px solid var(--red)", paddingBottom: 16, marginBottom: 32, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <span style={{ font: "700 11px var(--sans)", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--ink-3)" }}>À l'Heure</span>
              <h1 style={{ font: "800 36px var(--serif)", color: "var(--ink)", margin: "4px 0 0" }}>
                <span style={{ color: "var(--red)" }}>▶</span> Vidéos
              </h1>
            </div>
            <span style={{ font: "400 13px var(--sans)", color: "var(--ink-3)" }}>{VIDEOS.length} vidéos disponibles</span>
          </div>

          {/* Featured */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40, alignItems: "start" }}>
            <div style={{ position: "relative", aspectRatio: "16/9", background: "#111", borderRadius: 4, overflow: "hidden" }}>
              <img src={featured.thumb} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--red)"><polygon points="5,3 19,12 5,21"/></svg>
                </button>
              </div>
              <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,.75)", color: "#fff", font: "700 11px var(--sans)", padding: "3px 8px", borderRadius: 3 }}>{featured.duration}</span>
              <span style={{ position: "absolute", top: 10, left: 10, background: "var(--red)", color: "#fff", font: "700 10px var(--sans)", padding: "3px 8px", borderRadius: 3, textTransform: "uppercase", letterSpacing: ".06em" }}>{featured.category}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ font: "500 12px var(--sans)", color: "var(--ink-3)" }}>{featured.date}</span>
              <h2 style={{ font: "700 26px var(--serif)", color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>{featured.title}</h2>
              <p style={{ font: "400 15px var(--sans)", color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>{featured.desc}</p>
              <button style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, background: "var(--red)", color: "#fff", border: "none", borderRadius: 4, padding: "10px 20px", font: "700 13px var(--sans)", cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                Regarder — {featured.duration}
              </button>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {rest.map((v) => (
              <article key={v.slug}>
                <div style={{ position: "relative", aspectRatio: "16/9", background: "#111", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                  <img src={v.thumb} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <button style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--red)"><polygon points="5,3 19,12 5,21"/></svg>
                    </button>
                  </div>
                  <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,.75)", color: "#fff", font: "700 10px var(--sans)", padding: "2px 6px", borderRadius: 2 }}>{v.duration}</span>
                </div>
                <span style={{ font: "600 10px var(--sans)", color: "var(--red)", textTransform: "uppercase", letterSpacing: ".08em" }}>{v.category}</span>
                <h3 style={{ font: "700 16px var(--serif)", color: "var(--ink)", margin: "4px 0 6px", lineHeight: 1.25 }}>{v.title}</h3>
                <span style={{ font: "400 12px var(--sans)", color: "var(--ink-3)" }}>{v.date}</span>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
