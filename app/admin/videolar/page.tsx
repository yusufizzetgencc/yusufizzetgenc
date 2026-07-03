import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { deleteVideo } from "./actions"

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Videolar</h1>
          <p className="mt-2 text-muted-foreground">
            Ana sayfada gösterilecek YouTube videolarınızı yönetin.
          </p>
        </div>
        <Link href="/admin/videolar/new">
          <Button>
            <Plus className="mr-2 size-4" />
            Video Ekle
          </Button>
        </Link>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Henüz video eklenmemiş.
                </TableCell>
              </TableRow>
            ) : (
              videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">
                    {video.title}
                  </TableCell>
                  <TableCell>
                    <a 
                      href={video.youtubeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="mr-1 size-3" /> YouTube
                    </a>
                  </TableCell>
                  <TableCell>
                    {video.published ? (
                      <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        Yayında
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Gizli</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/videolar/${video.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                          <span className="sr-only">Düzenle</span>
                        </Button>
                      </Link>
                      <form
                        action={async () => {
                          "use server"
                          await deleteVideo(video.id)
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
