import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ExternalLink, Code2, Folder } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteProject } from "./actions"

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="space-y-6">
      {/* Sayfa Başlığı */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Folder className="size-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projeler</h1>
            <p className="text-sm text-muted-foreground">
              {projects.length} proje · Sitede sergilediğiniz projeleri yönetin.
            </p>
          </div>
        </div>
        <Link href="/admin/projeler/new">
          <Button className="gap-2">
            <Plus className="size-4" />
            Yeni Proje
          </Button>
        </Link>
      </div>

      {/* Tablo */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Proje Adı</TableHead>
              <TableHead className="font-semibold">Bağlantılar</TableHead>
              <TableHead className="font-semibold">Tarih</TableHead>
              <TableHead className="text-right font-semibold">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Folder className="size-8 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Henüz proje eklenmemiş.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="group">
                  <TableCell className="font-medium">
                    <div>
                      {project.title}
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {project.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        >
                          <ExternalLink className="size-3" /> Canlı
                        </a>
                      )}
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Code2 className="size-3" /> Kod
                        </a>
                      )}
                      {!project.liveUrl && !project.githubUrl && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/projeler/${project.id}`}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="size-4" />
                          <span className="sr-only">Düzenle</span>
                        </Button>
                      </Link>
                      <form
                        action={async () => {
                          "use server"
                          await deleteProject(project.id)
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
