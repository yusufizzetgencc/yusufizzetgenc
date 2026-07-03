import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Folder, Map as MapIcon, Pencil, Trash2, Layers } from "lucide-react"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yol Haritaları (Roadmap)</h1>
          <p className="mt-2 text-muted-foreground">
            Kategorileri, yol haritalarını ve konularını yönetin.
          </p>
        </div>
        <div className="flex gap-2">
          <CategoryDialog />
          {categories.length > 0 && (
            <RoadmapDialog categories={categoryListForDialog} />
          )}
        </div>
      </div>

      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className="rounded-md border border-border bg-card p-8 text-center text-muted-foreground">
            Henüz kategori eklenmemiş. Önce bir kategori oluşturun.
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="rounded-md border border-border bg-card overflow-hidden">
              <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-md border border-border">
                    <Folder className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      {category.title}
                      <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                        Kategori
                      </span>
                    </h2>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
              </div>

              <div className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Yol Haritası Adı</TableHead>
                      <TableHead>URL Slug</TableHead>
                      <TableHead>Konu Sayısı</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.roadmaps.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-16 text-center text-muted-foreground">
                          Bu kategoriye ait yol haritası bulunmuyor.
                        </TableCell>
                      </TableRow>
                    ) : (
                      category.roadmaps.map((roadmap) => (
                        <TableRow key={roadmap.id}>
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
                          <TableCell className="text-muted-foreground">{roadmap.slug}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Layers className="size-4" />
                              <span>{roadmap._count.topics} konu</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/roadmap/${roadmap.id}`}>
                                <Button variant="ghost" size="sm" className="h-8">
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
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}
