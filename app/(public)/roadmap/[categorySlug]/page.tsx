import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ChevronRight, ArrowLeft } from "lucide-react"

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string }
}) {
  const { categorySlug } = await params
  
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      roadmaps: {
        orderBy: { order: "asc" },
        include: {
          topics: {
            select: { id: true }
          }
        }
      }
    }
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-24 page-enter">
      {/* Geri Butonu */}
      <Link 
        href="/roadmap"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Tüm Kategoriler
      </Link>
      
      {/* Sayfa Başlığı */}
      <div className="mb-14 max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-lg text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>

      {/* Roadmap Listesi */}
      {category.roadmaps.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Bu kategoriye ait henüz bir yol haritası eklenmemiş.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {category.roadmaps.map((roadmap) => (
            <Link
              key={roadmap.id}
              href={`/roadmap/${category.slug}/${roadmap.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-indigo/40 hover:shadow-[0_4px_24px_-6px_rgba(99,102,241,0.12)]"
            >
              <div>
                <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">{roadmap.title}</h3>
                {roadmap.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {roadmap.description}
                  </p>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <span className="inline-block size-1.5 rounded-full bg-primary/40" />
                  {roadmap.topics.length} Konu
                </span>
                <span className="flex items-center text-sm font-medium text-indigo opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                  İncele <ChevronRight className="ml-1 size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
