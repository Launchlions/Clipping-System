import { AuthorizationError } from "@/lib/utils/errors"

export type Role = "BRAND" | "CLIPPER" | "ADMIN"

export type Permission = 
  | "campaign:create" 
  | "campaign:read" 
  | "campaign:update" 
  | "campaign:delete" 
  | "submission:create" 
  | "submission:review" 
  | "escrow:deposit" 
  | "escrow:view" 
  | "payout:view" 
  | "payout:override" 
  | "admin:access" 
  | "marketplace:browse" 
  | "claim:create"

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  BRAND: [
    "campaign:create",
    "campaign:read",
    "campaign:update",
    "campaign:delete",
    "submission:review",
    "escrow:deposit",
    "escrow:view",
    "marketplace:browse"
  ],
  CLIPPER: [
    "campaign:read",
    "submission:create",
    "escrow:view",
    "payout:view",
    "marketplace:browse",
    "claim:create"
  ],
  ADMIN: [
    "campaign:create",
    "campaign:read",
    "campaign:update",
    "campaign:delete",
    "submission:create",
    "submission:review",
    "escrow:deposit",
    "escrow:view",
    "payout:view",
    "payout:override",
    "admin:access",
    "marketplace:browse",
    "claim:create"
  ]
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new AuthorizationError(`Missing required permission: ${permission}`)
  }
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  if (pathname.startsWith("/brand")) return role === "BRAND"
  if (pathname.startsWith("/clipper")) return role === "CLIPPER"
  if (pathname.startsWith("/admin")) return role === "ADMIN"
  return true
}
