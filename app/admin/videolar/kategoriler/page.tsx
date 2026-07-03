import { prisma } from "@/lib/prisma"
import { Folder, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { deleteVideoCategory } from "../actions"
import { CategoryForm } from "./components/category-form"

export default async function VideoCategoriesPage() {
  const categories = await prisma.videoCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { videos: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/videolar"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10">
            <Folder className="size-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Video Kategorileri</h1>
            <p className="text-sm text-muted-foreground">
              Oynatma listeleri veya kategoriler oluşturun.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kategori Ekleme Formu */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold mb-4">Yeni Kategori</h2>
            <CategoryForm />
          </div>
        </div>

        {/* Kategoriler Listesi */}
        <div className="md:col-span-2 space-y-4">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
              <Folder className="size-10 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Henüz hiç kategori yok.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div>
                  <h3 className="font-semibold">{category.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>/{category.slug}</span>
                    <span>•</span>
                    <span>{category._count.videos} video</span>
                    <span>•</span>
                    <span>Sıra: {category.order}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <form
                    action={async () => {
                      "use server"
                      await deleteVideoCategory(category.id)
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      title="Sil"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
