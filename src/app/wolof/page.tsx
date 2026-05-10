import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const MOTS = [
  {
    word: "Téranga",
    pron: "/te.ʁaŋ.ɡa/",
    type: "n.f.",
    def: "Hospitalité, art de bien recevoir. Valeur cardinale de la société sénégalaise — partager le repas, l'ombre, le silence.",
    exemple: "« La téranga, c'est offrir ce qu'on a, même quand on n'a pas grand-chose. »",
    date: "Aujourd'hui",
    featured: true,
  },
  {
    word: "Xam-xam",
    pron: "/xam.xam/",
    type: "n.m.",
    def: "La connaissance, le savoir. Désigne à la fois le fait de savoir et le savoir lui-même.",
    exemple: "« Dafa am xam-xam » — Il a de la connaissance, il est instruit.",
    date: "6 mai 2026",
    featured: false,
  },
  {
    word: "Jëf-jël",
    pron: "/dʒɛf.dʒɛl/",
    type: "n.m.",
    def: "La réciprocité, l'échange équitable. Donner et recevoir en juste proportion.",
    exemple: "« Jëf-jël moo tax mbokk yi soxor. » — La réciprocité cimente les liens familiaux.",
    date: "5 mai 2026",
    featured: false,
  },
  {
    word: "Barça wala Barzakh",
    pron: "/baʁ.sa wa.la baʁ.zax/",
    type: "expr.",
    def: "Littéralement : « Barcelone ou l'au-delà ». Expression des candidats à l'émigration irrégulière, prêts à risquer leur vie pour rejoindre l'Europe.",
    exemple: "Cette expression résume le désespoir et la détermination de milliers de jeunes Sénégalais.",
    date: "4 mai 2026",
    featured: false,
  },
  {
    word: "Ndëkk",
    pron: "/ndɛk/",
    type: "n.m.",
    def: "Le matin, l'aurore. Symbolise le renouveau, le nouveau départ, la chance qui se présente.",
    exemple: "« Ndëkk bu bees moo newoon. » — Un nouveau matin est arrivé.",
    date: "3 mai 2026",
    featured: false,
  },
  {
    word: "Mbokk",
    pron: "/m.bɔk/",
    type: "n.m./adj.",
    def: "La parenté, le proche, le frère de sang ou de cœur. Désigne aussi l'appartenance à une même communauté.",
    exemple: "« Niit ñépp mbokk la. » — Tous les hommes sont parents.",
    date: "2 mai 2026",
    featured: false,
  },
  {
    word: "Sutura",
    pron: "/su.tu.ʁa/",
    type: "n.f.",
    def: "La pudeur, la discrétion, la dignité tranquille. Valeur morale centrale qui consiste à ne pas s'exposer, ne pas étaler ses peines ni ses richesses.",
    exemple: "« Sutura dafa gëna am solo ci këlifa yi. » — La discrétion vaut plus que la puissance.",
    date: "30 avr. 2026",
    featured: false,
  },
  {
    word: "Kersa",
    pron: "/kɛʁ.sa/",
    type: "n.f.",
    def: "La honte positive, la retenue, la conscience de ce qui est convenable. Ne pas agir de manière déshonorante pour soi ou sa famille.",
    exemple: "« Kersa moo teg nit ci bakkan bu baax. » — La honte positive place l'homme dans la voie du bien.",
    date: "29 avr. 2026",
    featured: false,
  },
];

export default function WolofPage() {
  const [featured, ...archive] = MOTS;

  return (
    <>
      <TopBar />
      <Masthead />
      <Nav />
      <main>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #0a5a3a 100%)", padding: "52px 0 44px" }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <span style={{ font: "700 11px var(--sans)", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }}>Culture · Langue</span>
            <h1 style={{ font: "800 42px var(--serif)", color: "#fff", margin: "8px 0 8px", fontStyle: "italic" }}>Mot du jour</h1>
            <p style={{ font: "400 15px var(--sans)", color: "rgba(255,255,255,.75)", margin: 0 }}>
              Un mot en wolof, chaque jour — pour mieux comprendre la culture sénégalaise
            </p>
          </div>
        </div>

        <div className="wrap" style={{ padding: "48px 28px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>
            {/* Mot du jour */}
            <div>
              <div style={{ border: "3px solid #0a5a3a", borderRadius: 8, padding: 36, marginBottom: 40, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, background: "#0a5a3a", color: "#fff", font: "700 10px var(--sans)", padding: "6px 14px", letterSpacing: ".12em", textTransform: "uppercase" }}>
                  Aujourd'hui
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ font: "900 56px var(--serif)", color: "#0a5a3a", lineHeight: 1, fontStyle: "italic" }}>{featured.word}</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "baseline" }}>
                  <span style={{ font: "400 15px var(--sans)", color: "var(--ink-3)", fontStyle: "italic" }}>{featured.pron}</span>
                  <span style={{ font: "500 12px var(--sans)", color: "var(--ink-3)", background: "var(--rule)", padding: "2px 8px", borderRadius: 3 }}>{featured.type}</span>
                </div>
                <p style={{ font: "400 17px var(--sans)", color: "var(--ink)", lineHeight: 1.65, marginBottom: 20 }}>{featured.def}</p>
                <blockquote style={{ borderLeft: "3px solid #0a5a3a", paddingLeft: 16, margin: 0, font: "400 15px var(--serif)", color: "var(--ink-2)", fontStyle: "italic", lineHeight: 1.55 }}>
                  {featured.exemple}
                </blockquote>
                <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                  <button style={{ background: "#0a5a3a", color: "#fff", border: "none", borderRadius: 4, padding: "8px 18px", font: "600 12px var(--sans)", cursor: "pointer" }}>
                    Partager
                  </button>
                  <button style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 4, padding: "8px 16px", font: "600 12px var(--sans)", color: "var(--ink-2)", cursor: "pointer" }}>
                    🔊 Écouter la prononciation
                  </button>
                </div>
              </div>

              {/* Archive */}
              <h2 style={{ font: "700 13px var(--sans)", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-3)", marginBottom: 20 }}>
                Mots précédents
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {archive.map((m) => (
                  <div key={m.word} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, padding: "20px 0", borderBottom: "1px solid var(--rule)", alignItems: "start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                        <span style={{ font: "700 22px var(--serif)", color: "var(--ink)", fontStyle: "italic" }}>{m.word}</span>
                        <span style={{ font: "400 13px var(--sans)", color: "var(--ink-3)", fontStyle: "italic" }}>{m.pron} · {m.type}</span>
                      </div>
                      <p style={{ font: "400 14px var(--sans)", color: "var(--ink-2)", margin: 0, lineHeight: 1.55 }}>{m.def}</p>
                    </div>
                    <span style={{ font: "400 12px var(--sans)", color: "var(--ink-3)", whiteSpace: "nowrap", paddingTop: 4 }}>{m.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside style={{ position: "sticky", top: 90, display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ background: "#f0f7f3", border: "1px solid #c8e6d4", borderRadius: 6, padding: 24 }}>
                <h3 style={{ font: "700 15px var(--serif)", color: "#0a5a3a", marginBottom: 8 }}>À propos du wolof</h3>
                <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
                  Le wolof est la langue la plus parlée au Sénégal, utilisée par environ 80% de la population comme langue maternelle ou seconde. Avec ses 12 classes nominales et sa richesse lexicale, il porte des concepts uniques qui n'ont pas d'équivalent direct en français.
                </p>
              </div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 6, padding: 24 }}>
                <h3 style={{ font: "700 15px var(--serif)", color: "var(--ink)", marginBottom: 4 }}>Newsletter Wolof</h3>
                <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 14 }}>
                  Recevez le mot du jour chaque matin dans votre boîte mail.
                </p>
                <a href="/newsletter" style={{ display: "block", textAlign: "center", background: "#0a5a3a", color: "#fff", padding: "10px", borderRadius: 4, font: "700 13px var(--sans)", textDecoration: "none" }}>
                  S'abonner — gratuit
                </a>
              </div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 6, padding: 24 }}>
                <h3 style={{ font: "700 14px var(--sans)", color: "var(--ink)", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".06em", fontSize: 12 }}>Thèmes abordés</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Valeurs", "Famille", "Société", "Nature", "Spiritualité", "Quotidien", "Proverbes", "Émotions"].map((t) => (
                    <span key={t} style={{ background: "#f0f7f3", color: "#0a5a3a", font: "500 11px var(--sans)", padding: "4px 10px", borderRadius: 12, border: "1px solid #c8e6d4" }}>{t}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
