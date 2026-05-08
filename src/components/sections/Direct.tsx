"use client";
import { useState, useRef, useEffect } from "react";

const PODCASTS = [
  { letter: "D", variant: "", show: "Les Décodeurs", title: "La CEDEAO peut-elle survivre au départ du Mali, du Burkina et du Niger ?", duration: "28 min", date: "Hier" },
  { letter: "T", variant: "b", show: "Téranga · Le portrait", title: "Aïssata Tall Sall : « la diplomatie sénégalaise se réinvente »", duration: "42 min", date: "Cette semaine" },
  { letter: "É", variant: "g", show: "Économie d'Afrique", title: "Pétrole sénégalais : à qui profite réellement la rente ?", duration: "35 min", date: "Lundi" },
];

const RFM_STREAM = "https://stream.zeno.fm/yn65fsaurfhvv";
const RFM_PAGE = "https://www.radio-senegal.com/radio-futurs-medias-940-fm";

const WAVE_HEIGHTS = [8,14,22,30,18,26,34,22,30,38,24,18,28,20,12,24,32,22,14,18,26,34,22,16,24,30,22,14,20,28,18,26,14,22,30,20,14,24,18,12];
const HOT_RANGE = [7, 8, 9, 10];

export default function Direct() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(RFM_STREAM);
    return () => { audioRef.current?.pause(); };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {
        window.open(RFM_PAGE, "_blank", "noopener,noreferrer");
      });
      setPlaying(true);
    }
  }

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
              EN DIRECT · RFM 94.0 FM
            </span>
            <div className="playerShow">Radio Futurs Médias · En direct</div>
            <h3>RFM — Radio Futurs Médias 94.0</h3>
            <div className="playerControls">
              <button
                className={`playBtn${playing ? " playing" : ""}`}
                aria-label={playing ? "Pause" : "Écouter RFM en direct"}
                onClick={togglePlay}
              />
              <div className="wave" aria-hidden="true">
                {WAVE_HEIGHTS.map((h, i) => (
                  <i key={i} className={playing && HOT_RANGE.includes(i) ? "hot" : ""} style={{ height: h }} />
                ))}
              </div>
            </div>
            <div className="playerNow">
              <span>RFM · 94.0 FM · Dakar</span>
              <a href={RFM_PAGE} target="_blank" rel="noopener noreferrer" style={{ font: "500 11px var(--sans)", color: "#a8b4cf" }}>
                radio-senegal.com ↗
              </a>
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
