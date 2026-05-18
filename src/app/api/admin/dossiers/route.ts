import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "src/data/dossiers.json");

type Dossier = {
  id: string;
  active: boolean;
  imgUrl: string;
  alt: string;
  label: string;
  title: string;
  dek: string;
  episode: string;
  href: string;
};

function read(): Dossier[] {
  try { return JSON.parse(readFileSync(FILE, "utf-8")); }
  catch { return []; }
}

function save(data: Dossier[]) {
  writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, dossier } = body;
    const all = read();

    if (action === "add") {
      const newDossier: Dossier = { ...dossier, id: `dossier-${Date.now()}`, active: true };
      save([newDossier, ...all]);
      return NextResponse.json({ ok: true, dossier: newDossier });
    }

    if (action === "update") {
      const updated = all.map((d) => d.id === id ? { ...d, ...dossier } : d);
      save(updated);
      return NextResponse.json({ ok: true });
    }

    if (action === "toggle") {
      const updated = all.map((d) => d.id === id ? { ...d, active: !d.active } : d);
      save(updated);
      return NextResponse.json({ ok: true });
    }

    if (action === "delete") {
      save(all.filter((d) => d.id !== id));
      return NextResponse.json({ ok: true });
    }

    if (action === "reorder") {
      const { ids } = body as { ids: string[]; action: string };
      const map = Object.fromEntries(all.map((d) => [d.id, d]));
      save(ids.map((id) => map[id]).filter(Boolean));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
