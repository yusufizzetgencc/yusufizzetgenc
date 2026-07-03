import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Next.js Middleware - Admin paneli koruması
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"
  const isAuthPage = req.nextUrl.pathname.startsWith("/giris")
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  if (isAuthPage) {
    if (isLoggedIn && isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl))
    }
    return NextResponse.next()
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/giris", req.nextUrl))
    }
    if (!isAdmin) {
      // Normal kullanıcı ise ana sayfaya at
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

// Middleware'in çalışacağı yollar
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
