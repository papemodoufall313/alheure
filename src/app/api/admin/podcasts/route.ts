import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

const FILE = join(process.cwd(), "src/data/podcasts.json");

export async function GET() {
  const data = JSON.parse(readFileSync(FILE, "utf-8"));
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const data = await req.json();
  writeFileSync(FILE, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}
