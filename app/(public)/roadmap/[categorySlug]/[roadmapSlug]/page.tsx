import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"
import { RoadmapFlow } from "../../components/roadmap-flow"

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

      {/* RoadmapFlow Component */}
      <RoadmapFlow topics={roadmap.topics} />
    </div>
  )
}
