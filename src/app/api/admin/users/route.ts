import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const FILE = join(process.cwd(), "src/data/users.json");

interface User {
  id: string;
  login: string;
  passwordHash: string;
  name: string;
  role: string;
}

export async function GET() {
  const users: User[] = JSON.parse(readFileSync(FILE, "utf-8"));
  // Never expose password hashes to the client
  return NextResponse.json(users.map(({ passwordHash: _, ...u }) => u));
}

export async function POST(req: Request) {
  const { action, id, login, name, role, password } = await req.json();
  const users: User[] = JSON.parse(readFileSync(FILE, "utf-8"));

  if (action === "create") {
    if (users.find((u) => u.login === login)) {
      return NextResponse.json({ error: "Identifiant déjà utilisé" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ id: `u-${Date.now()}`, login, name, role, passwordHash });
  }

  if (action === "update") {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    users[idx] = { ...users[idx], name, role };
    if (password) users[idx].passwordHash = await bcrypt.hash(password, 10);
  }

  if (action === "delete") {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    users.splice(idx, 1);
  }

  writeFileSync(FILE, JSON.stringify(users, null, 2));
  return NextResponse.json({ ok: true });
}
