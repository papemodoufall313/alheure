import { readFileSync } from "fs";
import { join } from "path";

type TickerItem = { id: string; time: string; dateIso?: string; text: string; active: boolean };

function getItems(): TickerItem[] {
  try {
    const raw = readFileSync(join(process.cwd(), "src/data/ticker.json"), "utf-8");
    return (JSON.parse(raw) as TickerItem[]).filter(i => i.active);
  } catch {
    return [];
  }
}

function tickerLabel(item: TickerItem): string {
  if (!item.dateIso) return item.time.replace(":", "h");

  const itemDate = new Date(item.dateIso);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);

  const hhmm = itemDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h");

  if (itemDate >= startOfToday) return hhmm;
  if (itemDate >= startOfYesterday) return `Hier · ${hhmm}`;
  return `${itemDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · ${hhmm}`;
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
              <time>{tickerLabel(item)}</time>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
