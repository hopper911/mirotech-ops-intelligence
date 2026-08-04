import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { BRAND } from "@/lib/brand";

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
        if (
          email === BRAND.demoCredentials.email &&
          password === BRAND.demoCredentials.password
        ) {
          return {
            id: "demo-operator",
            name: "Demo Operator",
            email: BRAND.demoCredentials.email,
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
  trustHost: true,
});
