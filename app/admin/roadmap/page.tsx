import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Folder, Map as MapIcon, Trash2, Layers } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteCategory, deleteRoadmap } from "./actions"
import { CategoryDialog } from "./components/category-dialog"
import { RoadmapDialog } from "./components/roadmap-dialog"

export default async function AdminRoadmapPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      roadmaps: {
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { topics: true },
          },
        },
      },
    },
  })

  // Roadmap Dialog için sadece id ve title olan kategoriler listesi
  const categoryListForDialog = categories.map(c => ({ id: c.id, title: c.title }))

  return (
    <div className="space-y-8">
      {/* Sayfa Başlığı */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10">
            <MapIcon className="size-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Yol Haritaları</h1>
            <p className="text-sm text-muted-foreground">
              Kategorileri, yol haritalarını ve konularını yönetin.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <CategoryDialog />
          {categories.length > 0 && (
            <RoadmapDialog categories={categoryListForDialog} />
          )}
        </div>
      </div>

      {/* Kategori Listesi */}
      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <Folder className="mb-3 size-10 text-muted-foreground/30" />
            <p className="font-medium">Henüz kategori eklenmemiş</p>
            <p className="mt-1 text-sm text-muted-foreground">Önce bir kategori oluşturun.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="overflow-hidden rounded-xl border border-border bg-card">
              {/* Kategori Header */}
              <div className="bg-muted/40 px-5 py-4 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/10">
                    <Folder className="size-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold flex items-center gap-2">
                      {category.title}
                      <span className="text-[0.65rem] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                        Kategori
                      </span>
                    </h2>
                    {category.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
                    )}
                  </div>
                </div>
                <form
                  action={async () => {
                    "use server"
                    await deleteCategory(category.id)
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    type="submit"
                    title="Kategoriyi Sil"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </form>
              </div>

              {/* Roadmap Tablosu */}
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Yol Haritası Adı</TableHead>
                    <TableHead className="font-semibold">URL Slug</TableHead>
                    <TableHead className="font-semibold">Konu Sayısı</TableHead>
                    <TableHead className="text-right font-semibold">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.roadmaps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                        Bu kategoriye ait yol haritası bulunmuyor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    category.roadmaps.map((roadmap) => (
                      <TableRow key={roadmap.id} className="group">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <MapIcon className="size-4 text-muted-foreground" />
                            <Link 
                              href={`/admin/roadmap/${roadmap.id}`}
                              className="hover:underline hover:text-primary transition-colors"
                            >
                              {roadmap.title}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">{roadmap.slug}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Layers className="size-3.5" />
                            <span className="text-sm">{roadmap._count.topics} konu</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link href={`/admin/roadmap/${roadmap.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                Detay / Konular
                              </Button>
                            </Link>
                            <form
                              action={async () => {
                                "use server"
                                await deleteRoadmap(roadmap.id)
                              }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                type="submit"
                                title="Roadmap Sil"
                              >
                                <Trash2 className="size-4" />
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
          ))
        )}
      </div>
    </div>
  )
}
