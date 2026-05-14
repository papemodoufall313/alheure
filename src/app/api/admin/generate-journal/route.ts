import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  // En production (Vercel), la génération doit se faire en local
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "La génération PDF n'est disponible qu'en local. Exécutez : python3 generate_journal.py" },
      { status: 400 }
    );
  }

  const { date, numero } = await req.json();
  const dateStr = date || new Date().toISOString().split("T")[0];
  const num     = numero || 1;
  const root    = process.cwd();
  const script  = join(root, "generate_journal.py");

  if (!existsSync(script)) {
    return NextResponse.json({ error: "Script generate_journal.py introuvable." }, { status: 500 });
  }

  return new Promise<NextResponse>((resolve) => {
    const proc = spawn("python3", [script, "--date", dateStr, "--numero", String(num)], { cwd: root });

    let stderr = "";
    proc.stderr.on("data", (d) => { stderr += d.toString(); });

    proc.on("close", (code) => {
      if (code !== 0) {
        resolve(NextResponse.json({ error: stderr || "Erreur lors de la génération." }, { status: 500 }));
      } else {
        const pdfPath = `/journal/alheure-${dateStr}.pdf`;
        resolve(NextResponse.json({ ok: true, path: pdfPath }));
      }
    });
  });
}

export async function GET() {
  // Liste les PDFs disponibles
  const { readdirSync } = await import("fs");
  const dir = join(process.cwd(), "public", "journal");
  try {
    const files = readdirSync(dir)
      .filter((f) => f.endsWith(".pdf"))
      .sort()
      .reverse()
      .map((f) => ({ name: f, path: `/journal/${f}` }));
    return NextResponse.json(files);
  } catch {
    return NextResponse.json([]);
  }
}
