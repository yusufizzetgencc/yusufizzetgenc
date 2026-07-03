import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, PlayCircle } from "lucide-react"

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
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <Link 
        href={`/roadmap/${categorySlug}`}
        className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        {roadmap.category.title}
      </Link>
      
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {roadmap.title}
        </h1>
        {roadmap.description && (
          <p className="text-lg text-muted-foreground">
            {roadmap.description}
          </p>
        )}
      </div>

      <div className="relative">
        {/* Sol taraftaki dikey çizgi */}
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border/60 hidden sm:block" />

        <div className="space-y-6 relative">
          {roadmap.topics.length === 0 ? (
             <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
             Bu yol haritası için henüz konu eklenmemiş.
           </div>
          ) : (
            roadmap.topics.map((topic, index) => (
              <div key={topic.id} className="relative flex items-start group">
                
                {/* Numara Dairesi */}
                <div className="z-10 hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-lg font-bold text-muted-foreground group-hover:border-indigo group-hover:text-indigo transition-colors mt-0.5">
                  {index + 1}
                </div>

                {/* İçerik Kartı */}
                <div className="sm:ml-8 flex-1">
                  <Link 
                    href={`/roadmap/${categorySlug}/${roadmapSlug}/${topic.slug}`}
                    className="block rounded-2xl border border-border bg-card p-6 transition-all hover:border-indigo/50 hover:shadow-[0_4px_20px_-4px_rgba(99,102,241,0.1)]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-indigo mb-2 sm:hidden">
                          Adım {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          {topic.title}
                        </h3>
                      </div>
                      <PlayCircle className="size-6 text-muted-foreground group-hover:text-indigo transition-colors" />
                    </div>
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
