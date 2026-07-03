"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"
import { buttonVariants } from "@/components/ui/button" // Buton stillerini içeri aktardık

const navItems = [
  { href: "/", label: "Anasayfa" },
  { href: "/blog", label: "Blog" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/projeler", label: "Projeler" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="text-lg font-bold tracking-tight">
            yusuf<span className="text-primary">izzet</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              {pathname === item.href && (
                <span className="mt-0.5 block h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions (Tema, Giriş, Kayıt ve Mobil Menü) */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
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
          <div className="h-4 w-px bg-border hidden md:block mx-1"></div>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}