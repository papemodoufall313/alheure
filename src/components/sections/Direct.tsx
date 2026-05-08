import { PODCASTS } from "@/lib/articles";

const WAVE_HEIGHTS = [8,14,22,30,18,26,34,22,30,38,24,18,28,20,12,24,32,22,14,18,26,34,22,16,24,30,22,14,20,28,18,26,14,22,30,20,14,24,18,12];
const HOT_RANGE = [7, 8, 9, 10];

export default function Direct() {
  return (
    <section className="directSection">
      <div className="wrap">
        <div className="directTop">
          <div>
            <span style={{ font: "800 11px var(--sans)", letterSpacing: ".18em", textTransform: "uppercase", color: "#f0c8c5" }}>
              ▶ En direct &amp; à la demande
            </span>
            <h2>Écoutez À l&apos;Heure</h2>
          </div>
          <span className="directSub">12 podcasts · 4 émissions en direct · 24h/24</span>
        </div>

        <div className="directGrid">
          {/* Live player */}
          <div className="player" role="region" aria-label="Lecteur radio en direct">
            <span className="playerLiveTag">
              <span className="d" aria-hidden="true" />
              EN DIRECT · ANTENNE
            </span>
            <div className="playerShow">JOURNAL · Présenté par Awa Sané</div>
            <h3>Le journal de 13h — édition spéciale Saint-Louis</h3>
            <div className="playerControls">
              <button className="playBtn" aria-label="Lire le journal" />
              <div className="wave" aria-hidden="true">
                {WAVE_HEIGHTS.map((h, i) => (
                  <i key={i} className={HOT_RANGE.includes(i) ? "hot" : ""} style={{ height: h }} />
                ))}
              </div>
            </div>
            <div className="playerNow">
              <span>13:00 — 14:00</span>
              <span>Prochain : Le Grand Débat · 14h</span>
            </div>
          </div>

          {/* Podcasts */}
          <div className="pods" role="list" aria-label="Derniers podcasts">
            {PODCASTS.map((pod) => (
              <div key={pod.title} className="pod" role="listitem">
                <div className={`podCover ${pod.variant}`} aria-hidden="true">{pod.letter}</div>
                <div className="podBody">
                  <span className="podShow">{pod.show}</span>
                  <h4>{pod.title}</h4>
                  <span className="podDur">{pod.duration} · {pod.date}</span>
                </div>
                <button className="podPlay" aria-label={`Écouter ${pod.show}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
