import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join, extname, basename } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".webp": "image/webp",
  ".gif": "image/gif", ".avif": "image/avif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  // Empêche la traversée de répertoire
  const safe = basename(filename);
  const filepath = join(UPLOAD_DIR, safe);

  if (!existsSync(filepath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = extname(safe).toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";
  const bytes = readFileSync(filepath);

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
