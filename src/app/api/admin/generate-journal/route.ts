import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { join } from "path";
import { existsSync, readdirSync } from "fs";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Génération disponible uniquement en local. Exécutez : python3 generate_journal_docx.py" },
      { status: 400 }
    );
  }

  const { date, numero, format = "docx" } = await req.json();
  const dateStr = date || new Date().toISOString().split("T")[0];
  const num     = numero || 1;
  const root    = process.cwd();
  const script  = join(root, format === "pdf" ? "generate_journal.py" : "generate_journal_docx.py");

  if (!existsSync(script)) {
    return NextResponse.json({ error: `Script ${script} introuvable.` }, { status: 500 });
  }

  return new Promise<NextResponse>((resolve) => {
    const proc = spawn("python3", [script, "--date", dateStr, "--numero", String(num)], { cwd: root });
    let stderr = "";
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("close", (code) => {
      if (code !== 0) {
        resolve(NextResponse.json({ error: stderr || "Erreur lors de la génération." }, { status: 500 }));
      } else {
        const ext  = format === "pdf" ? "pdf" : "docx";
        const path = `/journal/alheure-${dateStr}.${ext}`;
        resolve(NextResponse.json({ ok: true, path }));
      }
    });
  });
}

export async function GET() {
  const dir = join(process.cwd(), "public", "journal");
  try {
    const files = readdirSync(dir)
      .filter((f) => f.endsWith(".pdf") || f.endsWith(".docx"))
      .sort()
      .reverse()
      .map((f) => ({ name: f, path: `/journal/${f}`, type: f.endsWith(".pdf") ? "pdf" : "docx" }));
    return NextResponse.json(files);
  } catch {
    return NextResponse.json([]);
  }
}
