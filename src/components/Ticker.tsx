import { readFileSync } from "fs";
import { join } from "path";

type TickerItem = { id: string; time: string; text: string; active: boolean };

function getItems(): TickerItem[] {
  try {
    const raw = readFileSync(join(process.cwd(), "src/data/ticker.json"), "utf-8");
    return (JSON.parse(raw) as TickerItem[]).filter(i => i.active);
  } catch {
    return [];
  }
}

export default function Ticker() {
  const items  = getItems();
  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="ticker" role="marquee" aria-label="Dernières nouvelles en continu">
      <span className="tickerLabel">En continu</span>
      <div className="tickerItems">
        <div className="tickerTrack">
          {doubled.map((item, i) => (
            <span key={i}>
              {i > 0 && i % items.length !== 0 && (
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
