import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "src/data/ticker.json");

type TickerItem = { id: string; time: string; text: string; active: boolean };

function read(): TickerItem[] {
  return JSON.parse(readFileSync(FILE, "utf-8"));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  const body = await req.json();
  const items = read();

  // Ajout d'un nouvel item
  if (body.action === "add") {
    const { text, time } = body;
    if (!text?.trim()) return NextResponse.json({ error: "Texte manquant." }, { status: 400 });
    const id = Date.now().toString();
    items.unshift({ id, time: time || new Date().toTimeString().slice(0, 5), text: text.trim(), active: true });
  }

  // Suppression
  else if (body.action === "delete") {
    const idx = items.findIndex(i => i.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    items.splice(idx, 1);
  }

  // Activer / désactiver
  else if (body.action === "toggle") {
    const item = items.find(i => i.id === body.id);
    if (!item) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    item.active = !item.active;
  }

  // Modifier le texte ou l'heure
  else if (body.action === "update") {
    const item = items.find(i => i.id === body.id);
    if (!item) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    if (body.text !== undefined) item.text = body.text;
    if (body.time !== undefined) item.time = body.time;
  }

  else {
    return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
  }

  writeFileSync(FILE, JSON.stringify(items, null, 2));
  return NextResponse.json({ ok: true, items });
}
