import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/giris",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // Empty array for now
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
