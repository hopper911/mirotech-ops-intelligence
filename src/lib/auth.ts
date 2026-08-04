import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { BRAND } from "@/lib/brand";
import type { UserRole } from "@/lib/roles";

function resolveAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL?.trim() || BRAND.adminCredentials.email,
    password: process.env.ADMIN_PASSWORD?.trim() || BRAND.adminCredentials.password,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        const admin = resolveAdminCredentials();

        if (email === admin.email && password === admin.password) {
          return {
            id: "demo-admin",
            name: "Demo Admin",
            email: admin.email,
            role: "admin" satisfies UserRole,
          };
        }

        if (
          email === BRAND.demoCredentials.email &&
          password === BRAND.demoCredentials.password
        ) {
          return {
            id: "demo-client",
            name: "Demo Client",
            email: BRAND.demoCredentials.email,
            role: "client" satisfies UserRole,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const role = token.role === "admin" ? "admin" : "client";
        session.user.role = role;
      }
      return session;
    },
  },
  trustHost: true,
});

export function isAdminSession(session: { user?: { role?: UserRole } } | null) {
  return session?.user?.role === "admin";
}
