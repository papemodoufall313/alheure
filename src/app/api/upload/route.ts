import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

  const ext = extname(file.name).toLowerCase() || ".jpg";
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Format non supporté" }, { status: 400 });
  }

  const filename = `${Date.now()}${ext}`;
  const uploadDir = join(process.cwd(), "public/uploads");
  mkdirSync(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
