import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"

// YouTube URL'sinden embed linkini çıkaran yardımcı fonksiyon
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null
  
  // youtu.be/ID veya youtube.com/watch?v=ID formatlarını destekler
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }
  return null
}

export default async function TopicDetailPage({
  params,
}: {
  params: { categorySlug: string; roadmapSlug: string; topicSlug: string }
}) {
  const { categorySlug, roadmapSlug, topicSlug } = await params

  // İlgili yol haritasını tüm konularıyla beraber çekiyoruz (Sırasına göre)
  const roadmap = await prisma.roadmap.findUnique({
    where: { slug: roadmapSlug },
    include: {
      category: true,
      topics: {
        orderBy: { order: "asc" },
      }
    }
  })

  // Roadmap yoksa veya kategori uyuşmuyorsa 404
  if (!roadmap || roadmap.category.slug !== categorySlug) {
    notFound()
  }

  // Şu anki konuyu bul
  const currentIndex = roadmap.topics.findIndex(t => t.slug === topicSlug)
  
  // Konu yoksa 404
  if (currentIndex === -1) {
    notFound()
  }

  const topic = roadmap.topics[currentIndex]
  const prevTopic = currentIndex > 0 ? roadmap.topics[currentIndex - 1] : null
  const nextTopic = currentIndex < roadmap.topics.length - 1 ? roadmap.topics[currentIndex + 1] : null

  const embedUrl = topic.videoUrl ? getYouTubeEmbedUrl(topic.videoUrl) : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20 page-enter">
      
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Link href={`/roadmap/${categorySlug}`} className="hover:text-foreground transition-colors">
          {roadmap.category.title}
        </Link>
        <ChevronRight className="size-3" />
        <Link href={`/roadmap/${categorySlug}/${roadmapSlug}`} className="hover:text-foreground transition-colors">
          {roadmap.title}
        </Link>
      </nav>

      <div className="mb-8">
        <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
          Adım {currentIndex + 1} / {roadmap.topics.length}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl leading-[1.15]">
          {topic.title}
        </h1>
      </div>

      {/* Video Kısmı */}
      {embedUrl && (
        <div className="mb-12 overflow-hidden rounded-xl border border-border bg-black shadow-lg">
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              title={topic.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}

      {/* İçerik Kısmı */}
      {topic.content && (
        <div 
          className="prose prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary/30"
          dangerouslySetInnerHTML={{ __html: topic.content }}
        />
      )}

      {/* Ayırıcı */}
      <div className="my-14 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Önceki - Sonraki Butonları */}
      <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/roadmap/${categorySlug}/${roadmapSlug}/${prevTopic.slug}`}
            className="group flex w-full sm:w-auto items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-border hover:bg-muted/50"
          >
            <ArrowLeft className="size-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            <div className="text-left min-w-0">
              <div className="text-xs text-muted-foreground">Önceki Konu</div>
              <div className="font-medium truncate">{prevTopic.title}</div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextTopic && (
          <Link
            href={`/roadmap/${categorySlug}/${roadmapSlug}/${nextTopic.slug}`}
            className="group flex w-full sm:w-auto items-center justify-end gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 transition-all hover:bg-primary/10 hover:border-primary/40 text-right"
          >
            <div className="text-right min-w-0">
              <div className="text-xs text-primary/70">Sıradaki Konu</div>
              <div className="font-medium text-primary truncate">{nextTopic.title}</div>
            </div>
            <ArrowRight className="size-5 text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        )}
      </div>

    </div>
  )
}
