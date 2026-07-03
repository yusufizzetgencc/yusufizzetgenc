import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar (Client component — aktif sayfa göstergesi için) */}
      <AdminSidebar userName={session?.user?.name} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-muted/20">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between border-b border-border/40 bg-background/80 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Sistem Aktif</span>
          </div>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              Çıkış
            </Button>
          </form>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 page-enter">{children}</main>
      </div>
    </div>
  )
}
