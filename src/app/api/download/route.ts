import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = join(process.cwd(), "public", "images.zip");
  const file = readFileSync(filePath);
  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="images-alheure.zip"',
      "Content-Length": String(file.length),
    },
  });
}
