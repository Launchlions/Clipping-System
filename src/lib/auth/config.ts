import { NextAuthOptions, getServerSession as _getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "BRAND" | "CLIPPER" | "ADMIN"
      image?: string
    }
  }
  interface User {
    id: string
    role: "BRAND" | "CLIPPER" | "ADMIN"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "BRAND" | "CLIPPER" | "ADMIN"
    userId: string
  }
}

const MOCK_USERS = [
  { id: "brand-1", email: "brand@demo.com", password: "password", name: "Acme Corp", role: "BRAND" as const },
  { id: "clipper-1", email: "clipper@demo.com", password: "password", name: "Alex Creator", role: "CLIPPER" as const },
  { id: "admin-1", email: "admin@demo.com", password: "password", name: "Admin User", role: "ADMIN" as const },
]

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const user = MOCK_USERS.find(u => u.email === credentials.email && u.password === credentials.password)
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "clipbridge-jwt-production-secret-key-99a8x12Zv",
}

export function getServerSession() {
  return _getServerSession(authOptions)
}
