const ITEMS = [
  { time: "17:30", text: "Code électoral — Diomaye Faye bloque la promulgation après réception de deux versions contradictoires de la loi" },
  { time: "16:00", text: "Mondial 2026 — Koulibaly incertain, Lamine Sané rassure : « Les Lions sont prêts »" },
  { time: "15:45", text: "Meeting Sargal à Mbour : des dizaines de milliers de militants pour soutenir Diomaye Faye" },
  { time: "14:00", text: "Shakira x Burna Boy — « Dai Dai » dévoilé, l'hymne officiel de la Coupe du Monde 2026" },
  { time: "13:20", text: "Mali — Deux camions piégés visaient la résidence d'Assimi Goïta, révèle le ministre Abdoulaye Diop" },
  { time: "12:45", text: "APR · Thérèse Faye invite Macky Sall à clarifier ses intentions avant 2029" },
  { time: "11:30", text: "Mamour Diallo dément sa mort sur les réseaux : « Je me porte à merveille »" },
  { time: "10:30", text: "Économie · Sénégal : excédent commercial de 188 milliards FCFA en mars 2026, porté par le pétrole" },
  { time: "09:00", text: "Nioro du Rip — Une attaque à main armée déjouée par la gendarmerie après échange de tirs" },
  { time: "08:00", text: "Sahel · Un hélicoptère de l'armée malienne aurait été abattu près de Gao" },
];

export default function Ticker() {
  // Duplicated for seamless loop
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="ticker" role="marquee" aria-label="Dernières nouvelles en continu">
      <span className="tickerLabel">En continu</span>
      <div className="tickerItems">
        <div className="tickerTrack">
          {doubled.map((item, i) => (
            <span key={i}>
              {i > 0 && i % ITEMS.length !== 0 && (
                <span className="sep" aria-hidden="true"> ● </span>
              )}
              <time>{item.time}</time>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
