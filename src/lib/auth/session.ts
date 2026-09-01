import { getServerSession } from "@/lib/auth/config"
import { AuthenticationError, AuthorizationError } from "@/lib/utils/errors"
import { Role } from "@/lib/auth/rbac"
import { Session } from "next-auth"

export async function getCurrentUser(): Promise<Session["user"] | null> {
  const session = await getServerSession()
  return session?.user || null
}

export async function requireAuth(): Promise<Session["user"]> {
  const user = await getCurrentUser()
  if (!user) {
    throw new AuthenticationError("Authentication required")
  }
  return user
}

export async function requireRole(role: Role): Promise<Session["user"]> {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new AuthorizationError(`Required role: ${role}`)
  }
  return user
}
