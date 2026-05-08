import Link from "next/link";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <TopBar />
      <Masthead />
      <Nav />
      <main>
        <div className="wrap" style={{ padding: "80px 28px", textAlign: "center" }}>
          <span style={{ font: "800 11px var(--sans)", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--red)" }}>
            Erreur 404
          </span>
          <h1 style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(42px, 8vw, 80px)", fontWeight: 800, color: "var(--blue)", margin: "16px 0 12px", lineHeight: 1.05 }}>
            Page introuvable
          </h1>
          <p style={{ font: "400 17px/1.6 var(--sans)", color: "var(--ink-2)", maxWidth: 480, margin: "0 auto 32px" }}>
            La page que vous cherchez n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil pour continuer votre lecture.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "var(--blue)",
              color: "#fff",
              font: "700 13px var(--sans)",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              padding: "12px 28px",
              textDecoration: "none",
            }}
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
