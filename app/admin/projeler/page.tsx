import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ExternalLink, Code2 } from "lucide-react"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projeler</h1>
          <p className="mt-2 text-muted-foreground">
            Sitede sergilediğiniz projeleri yönetin.
          </p>
        </div>
        <Link href="/admin/projeler/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Yeni Proje
          </Button>
        </Link>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proje Adı</TableHead>
              <TableHead>Bağlantılar</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Henüz proje eklenmemiş.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
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
                          className="flex items-center text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="mr-1 size-3" /> Canlı
                        </a>
                      )}
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Code2 className="mr-1 size-3" /> Kod
                        </a>
                      )}
                      {!project.liveUrl && !project.githubUrl && (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/projeler/${project.id}`}>
                        <Button variant="ghost" size="icon">
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
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
