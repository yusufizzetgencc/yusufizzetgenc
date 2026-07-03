import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { LayoutDashboard, FileText, Map, Folder, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog Yazıları", icon: FileText },
  { href: "/admin/roadmap", label: "Yol Haritaları", icon: Map },
  { href: "/admin/projeler", label: "Projeler", icon: Folder },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border/40 bg-background md:flex">
        <div className="flex h-14 items-center border-b border-border/40 px-4">
          <span className="font-semibold text-primary">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border/40 p-4">
          <div className="mb-4 flex items-center gap-3 px-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session?.user?.name}</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-4" />
              Çıkış Yap
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
