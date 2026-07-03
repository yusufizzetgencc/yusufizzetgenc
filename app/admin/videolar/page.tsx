import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ExternalLink, MonitorPlay } from "lucide-react"
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
      {/* Sayfa Başlığı */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10">
            <MonitorPlay className="size-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Videolar</h1>
            <p className="text-sm text-muted-foreground">
              {videos.length} video · Ana sayfada gösterilecek YouTube videolarınızı yönetin.
            </p>
          </div>
        </div>
        <Link href="/admin/videolar/new">
          <Button className="gap-2">
            <Plus className="size-4" />
            Video Ekle
          </Button>
        </Link>
      </div>

      {/* Tablo */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Başlık</TableHead>
              <TableHead className="font-semibold">Link</TableHead>
              <TableHead className="font-semibold">Durum</TableHead>
              <TableHead className="text-right font-semibold">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <MonitorPlay className="size-8 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Henüz video eklenmemiş.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              videos.map((video) => (
                <TableRow key={video.id} className="group">
                  <TableCell className="font-medium">
                    {video.title}
                  </TableCell>
                  <TableCell>
                    <a 
                      href={video.youtubeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors w-fit"
                    >
                      <ExternalLink className="size-3" /> YouTube
                    </a>
                  </TableCell>
                  <TableCell>
                    {video.published ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">
                        Yayında
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Gizli</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/videolar/${video.id}`}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
