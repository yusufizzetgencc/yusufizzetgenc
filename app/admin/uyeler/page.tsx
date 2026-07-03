import { prisma } from "@/lib/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      {/* Sayfa Başlığı */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Users className="size-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Üyeler</h1>
          <p className="text-sm text-muted-foreground">
            {users.length} kullanıcı · Sisteme kayıtlı tüm kullanıcıları listeleyin.
          </p>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">İsim</TableHead>
              <TableHead className="font-semibold">E-posta</TableHead>
              <TableHead className="font-semibold">Rol</TableHead>
              <TableHead className="text-right font-semibold">Kayıt Tarihi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="size-8 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Kayıtlı kullanıcı bulunmuyor.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {user.name?.charAt(0) || "?"}
                      </div>
                      {user.name || "İsimsiz Kullanıcı"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    {user.role === "ADMIN" ? (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Admin</Badge>
                    ) : (
                      <Badge variant="secondary">Kullanıcı</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
