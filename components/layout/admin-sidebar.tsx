"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Map, Folder, MonitorPlay, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "Blog Yazıları", icon: FileText, exact: false },
  { href: "/admin/roadmap", label: "Yol Haritaları", icon: Map, exact: false },
  { href: "/admin/projeler", label: "Projeler", icon: Folder, exact: false },
  { href: "/admin/videolar", label: "Videolar", icon: MonitorPlay, exact: false },
  { href: "/admin/uyeler", label: "Üyeler", icon: Users, exact: false },
]

export function AdminSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-border/40 bg-card/50 md:flex">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b border-border/40 px-5">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="size-3.5" />
          </div>
          <span className="font-semibold tracking-tight">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-3">
        <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Yönetim
        </p>
        {sidebarLinks.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href)
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/8 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-transparent"
              )}
            >
              <Icon className={cn("size-4", isActive && "text-primary")} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {userName?.charAt(0) || "A"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userName || "Admin"}</span>
            <span className="text-[0.65rem] text-muted-foreground">Yönetici</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
