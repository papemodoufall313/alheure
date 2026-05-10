import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";

interface User {
  id: string;
  login: string;
  passwordHash: string;
  name: string;
  role: string;
}

function getUsers(): User[] {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "src/data/users.json"), "utf-8"));
  } catch {
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        login: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;
        const users = getUsers();
        const user = users.find((u) => u.login === credentials.login);
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.login, role: user.role } as never;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as never as { role: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as never as { role: string }).role = token.role as string;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
