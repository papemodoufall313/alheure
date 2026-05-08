const ITEMS = [
  { time: "13:42", text: "L'Assemblée nationale adopte la loi de finances rectificative à 142 voix contre 38" },
  { time: "13:18", text: "Touba — 5,2 millions de fidèles attendus pour le Magal" },
  { time: "12:55", text: "BRT Dakar : la ligne 2 entrera en service le 1er juin" },
  { time: "12:31", text: "CEDEAO — réunion d'urgence des ministres de la défense vendredi à Abuja" },
  { time: "11:48", text: "Lions de la Téranga : Sadio Mané rappelé en sélection" },
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
