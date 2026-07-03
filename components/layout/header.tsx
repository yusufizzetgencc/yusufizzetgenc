"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"
import { buttonVariants } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Anasayfa" },
  { href: "/blog", label: "Blog" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/projeler", label: "Projeler" },
]

export function Header() {
  const pathname = usePathname()

  // Admin sayfalarında header gösterme (admin kendi layoutunu kullanır)
  if (pathname.startsWith("/admin")) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-1.5 transition-opacity hover:opacity-80"
        >
          <span className="text-lg font-bold tracking-tight">
            yusuf
            <span className="text-primary">izzet</span>
          </span>
          <span className="inline-block size-1.5 rounded-full bg-primary transition-transform group-hover:scale-125" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {/* Aktif sayfa alt çizgisi — animasyonlu */}
                <span
                  className={cn(
                    "absolute inset-x-2 -bottom-[calc(0.5rem+1px)] h-0.5 rounded-full bg-primary transition-all duration-300",
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  )}
                />
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1.5 md:flex">
            <Link
              href="/giris"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Giriş
            </Link>
            <Link
              href="/kayit"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Kayıt Ol
            </Link>
          </div>
          <div className="mx-1 hidden h-5 w-px bg-border/60 md:block" />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}