import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, PlayCircle, ChevronRight } from "lucide-react"

export default async function RoadmapDetailPage({
  params,
}: {
  params: { categorySlug: string; roadmapSlug: string }
}) {
  const { categorySlug, roadmapSlug } = await params
  
  const roadmap = await prisma.roadmap.findUnique({
    where: { slug: roadmapSlug },
    include: {
      category: true,
      topics: {
        orderBy: { order: "asc" },
      }
    }
  })

  // Roadmap bulunamazsa veya ait olduğu kategori yanlış girilmişse
  if (!roadmap || roadmap.category.slug !== categorySlug) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 page-enter">
      {/* Geri Butonu */}
      <Link 
        href={`/roadmap/${categorySlug}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        {roadmap.category.title}
      </Link>
      
      {/* Başlık Alanı */}
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {roadmap.title}
        </h1>
        {roadmap.description && (
          <p className="text-lg text-muted-foreground">
            {roadmap.description}
          </p>
        )}
        {roadmap.topics.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {roadmap.topics.length} konu · Sırasıyla ilerle
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Sol taraftaki dikey çizgi */}
        <div className="absolute left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-border via-border/60 to-transparent hidden sm:block" />

        <div className="space-y-4 relative">
          {roadmap.topics.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Bu yol haritası için henüz konu eklenmemiş.
            </div>
          ) : (
            roadmap.topics.map((topic, index) => (
              <div key={topic.id} className="relative flex items-start group">
                
                {/* Numara Dairesi */}
                <div className="z-10 hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-lg font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary group-hover:shadow-[0_0_0_4px_rgba(99,102,241,0.08)] transition-all mt-0.5">
                  {index + 1}
                </div>

                {/* İçerik Kartı */}
                <div className="sm:ml-6 flex-1">
                  <Link 
                    href={`/roadmap/${categorySlug}/${roadmapSlug}/${topic.slug}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-indigo/40 hover:shadow-[0_4px_24px_-6px_rgba(99,102,241,0.12)] hover:bg-card/80"
                  >
                    <div>
                      <div className="text-xs font-medium text-primary/70 mb-1.5 sm:hidden">
                        Adım {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                        {topic.title}
                      </h3>
                      {topic.videoUrl && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <PlayCircle className="size-3" /> Video mevcut
                        </span>
                      )}
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-4" />
                  </Link>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
