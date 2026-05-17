import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const ext = extname(file.name).toLowerCase() || ".jpg";
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: `Format non supporté : ${ext}` }, { status: 400 });
    }

    const filename = `${Date.now()}${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    mkdirSync(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    writeFileSync(join(uploadDir, filename), Buffer.from(bytes));

    return NextResponse.json({ url: `/api/files/${filename}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] error:", msg);
    return NextResponse.json({ error: `Erreur serveur : ${msg}` }, { status: 500 });
  }
}
