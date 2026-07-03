import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical } from "lucide-react"
import { deleteTopic } from "../actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminRoadmapDetailPage({
  params,
}: {
  params: { roadmapId: string }
}) {
  const { roadmapId } = await params

  const roadmap = await prisma.roadmap.findUnique({
    where: { id: roadmapId },
    include: {
      category: true,
      topics: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!roadmap) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/roadmap"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {roadmap.category.title}
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              Yol Haritası
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-1">{roadmap.title}</h1>
          {roadmap.description && (
            <p className="mt-1 text-muted-foreground">{roadmap.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <h2 className="text-xl font-semibold">Konular (Topics)</h2>
        <Link href={`/admin/roadmap/${roadmap.id}/topics/new`}>
          <Button>
            <Plus className="mr-2 size-4" />
            Yeni Konu Ekle
          </Button>
        </Link>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Video Linki</TableHead>
              <TableHead>URL Slug</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roadmap.topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Henüz konu eklenmemiş.
                </TableCell>
              </TableRow>
            ) : (
              roadmap.topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>
                    <GripVertical className="size-4 text-muted-foreground cursor-move" />
                  </TableCell>
                  <TableCell className="font-medium">{topic.title}</TableCell>
                  <TableCell>
                    {topic.videoUrl ? (
                      <a href={topic.videoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px] inline-block">
                        Bağlantı
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{topic.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/roadmap/${roadmap.id}/topics/${topic.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                          <span className="sr-only">Düzenle</span>
                        </Button>
                      </Link>
                      <form
                        action={async () => {
                          "use server"
                          await deleteTopic(topic.id, roadmap.id)
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
