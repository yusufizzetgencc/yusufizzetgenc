"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, BookOpen, Map, Folder, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Anasayfa", icon: Home },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/projeler", label: "Projeler", icon: Folder },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Body scroll kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <nav
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-xs border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
            <span className="text-lg font-bold tracking-tight">
              yusuf<span className="text-primary">izzet</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Menüyü kapat"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] font-medium transition-colors",
                        isActive
                          ? "bg-primary/8 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Alt Kısım: Auth Butonları */}
          <div className="border-t border-border/40 p-4 space-y-2">
            <Link
              href="/giris"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <LogIn className="size-4" />
              Giriş Yap
            </Link>
            <Link
              href="/kayit"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <UserPlus className="size-4" />
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
