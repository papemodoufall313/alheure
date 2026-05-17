import { readFileSync } from "fs";
import { join } from "path";
import Image from "next/image";
import Link from "next/link";

interface Une { imgUrl: string; date: string; numero: string; headline: string; active: boolean }

function getUne(): Une {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "src/data/une.json"), "utf-8"));
  } catch {
    return { imgUrl: "", date: "", numero: "", headline: "", active: false };
  }
}

export default function UneJournal() {
  const une = getUne();
  if (!une.active || !une.imgUrl) return null;

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="secHead" style={{ marginBottom: 20 }}>
          <div className="l">
            <span className="kicker">Édition papier</span>
            <h2>La Une du jour</h2>
          </div>
          {une.date && (
            <span style={{ font: "400 13px var(--sans)", color: "var(--ink-2)" }}>
              {une.numero && <strong>N°{une.numero} · </strong>}{une.date}
            </span>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>
          <div style={{ position: "relative", width: 280, flexShrink: 0, boxShadow: "0 4px 20px rgba(0,0,0,.18)", borderRadius: 2, overflow: "hidden" }}>
            <Image
              src={une.imgUrl}
              alt={`Une du journal À l'Heure — ${une.date}`}
              width={280}
              height={396}
              style={{ display: "block", width: "100%", height: "auto" }}
              unoptimized
            />
          </div>

          <div style={{ paddingTop: 8 }}>
            <div style={{ font: "800 11px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>
              À l&apos;Heure · Le quotidien d&apos;information
            </div>
            {une.headline && (
              <h3 style={{ font: "700 26px/1.2 var(--serif)", color: "var(--ink)", margin: "0 0 16px", maxWidth: 480 }}>
                {une.headline}
              </h3>
            )}
            <p style={{ font: "400 14px var(--sans)", color: "var(--ink-2)", lineHeight: 1.6, maxWidth: 440, margin: "0 0 24px" }}>
              Retrouvez chaque matin l&apos;édition papier d&apos;À l&apos;Heure dans les kiosques de Dakar et des grandes villes du Sénégal.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={une.imgUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: "var(--blue)", color: "#fff", padding: "10px 20px", font: "700 12px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2, display: "inline-block" }}
              >
                Voir la Une en grand
              </a>
              <Link
                href="/newsletter"
                style={{ background: "transparent", color: "var(--blue)", border: "1.5px solid var(--blue)", padding: "10px 20px", font: "700 12px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2, display: "inline-block" }}
              >
                S&apos;abonner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
