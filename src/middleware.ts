import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "clipbridge-jwt-production-secret-key-99a8x12Zv" })
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const isPublicAuthRoute = pathname === "/login" || pathname === "/signup" || pathname === "/"

  if (!token) {
    if (isPublicAuthRoute) {
      return NextResponse.next()
    }
    
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", req.url)
    return NextResponse.redirect(url)
  }

  const role = token.role

  if (isPublicAuthRoute) {
    if (role === "BRAND") return NextResponse.redirect(new URL("/brand/dashboard", req.url))
    if (role === "CLIPPER") return NextResponse.redirect(new URL("/clipper/dashboard", req.url))
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    return NextResponse.next()
  }

  if (pathname.startsWith("/brand") && role !== "BRAND") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), req.url))
  }
  if (pathname.startsWith("/clipper") && role !== "CLIPPER") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), req.url))
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), req.url))
  }

  return NextResponse.next()
}

function getRoleDashboard(role: string): string {
  switch (role) {
    case "BRAND": return "/brand/dashboard"
    case "CLIPPER": return "/clipper/dashboard"
    case "ADMIN": return "/admin/dashboard"
    default: return "/"
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
