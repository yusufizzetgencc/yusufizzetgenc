import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, FileText } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { deletePost } from "./actions"

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  })

  return (
    <div className="space-y-6">
      {/* Sayfa Başlığı */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10">
            <FileText className="size-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Blog Yazıları</h1>
            <p className="text-sm text-muted-foreground">
              {posts.length} yazı · Sitede yayınlanacak blog yazılarını yönetin.
            </p>
          </div>
        </div>
        <Link href="/admin/blog/new">
          <Button className="gap-2">
            <Plus className="size-4" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      {/* Tablo */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Başlık</TableHead>
              <TableHead className="font-semibold">Durum</TableHead>
              <TableHead className="font-semibold">Tarih</TableHead>
              <TableHead className="text-right font-semibold">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="size-8 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Henüz blog yazısı eklenmemiş.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post: any) => (
                <TableRow key={post.id} className="group">
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">
                        Yayında
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Taslak</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/blog/${post.id}`}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="size-4" />
                          <span className="sr-only">Düzenle</span>
                        </Button>
                      </Link>
                      <form
                        action={async () => {
                          "use server"
                          await deletePost(post.id)
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          type="submit"
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Sil</span>
                        </Button>
                      </form>
                    </div>
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