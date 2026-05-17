import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FILE = join(process.cwd(), "src/data/une.json");

function read() {
  try { return JSON.parse(readFileSync(FILE, "utf-8")); }
  catch { return { imgUrl: "", date: "", numero: "", headline: "", active: false }; }
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  if (action === "save") {
    const une = { imgUrl: body.imgUrl ?? "", date: body.date ?? "", numero: body.numero ?? "", headline: body.headline ?? "", active: body.active ?? false };
    writeFileSync(FILE, JSON.stringify(une, null, 2));
    return NextResponse.json({ ok: true, une });
  }

  return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
}
