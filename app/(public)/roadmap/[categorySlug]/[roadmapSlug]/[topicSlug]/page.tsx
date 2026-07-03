import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react"

// YouTube URL'sinden embed linkini çıkaran yardımcı fonksiyon
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null
  
  // youtu.be/ID veya youtube.com/watch?v=ID formatlarını destekler
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
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
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      
      {/* Üst Yönlendirme Menüsü */}
      <nav className="mb-10 flex items-center text-sm font-medium text-muted-foreground">
        <Link href={`/roadmap/${categorySlug}`} className="hover:text-foreground transition-colors">
          {roadmap.category.title}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/roadmap/${categorySlug}/${roadmapSlug}`} className="hover:text-foreground transition-colors">
          {roadmap.title}
        </Link>
      </nav>

      <div className="mb-8">
        <div className="mb-4 inline-flex items-center rounded-full border border-indigo/20 bg-indigo/10 px-3 py-1 text-xs font-semibold text-indigo">
          Adım {currentIndex + 1} / {roadmap.topics.length}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {topic.title}
        </h1>
      </div>

      {/* Video Kısmı */}
      {embedUrl && (
        <div className="mb-12 overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
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
          className="prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: topic.content }}
        />
      )}

      <hr className="my-12 border-border" />

      {/* Önceki - Sonraki Butonları */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/roadmap/${categorySlug}/${roadmapSlug}/${prevTopic.slug}`}
            className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2 rounded-xl border border-border bg-card px-6 py-4 transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Önceki Konu</div>
              <div className="font-medium line-clamp-1">{prevTopic.title}</div>
            </div>
          </Link>
        ) : (
          <div className="w-full sm:w-auto" />
        )}

        {nextTopic && (
          <Link
            href={`/roadmap/${categorySlug}/${roadmapSlug}/${nextTopic.slug}`}
            className="flex w-full sm:w-auto items-center justify-center sm:justify-end gap-2 rounded-xl border border-indigo bg-indigo/5 px-6 py-4 transition-colors hover:bg-indigo/10 text-right"
          >
            <div className="text-right">
              <div className="text-xs text-indigo">Sıradaki Konu</div>
              <div className="font-medium text-indigo line-clamp-1">{nextTopic.title}</div>
            </div>
            <ArrowRight className="size-5 text-indigo" />
          </Link>
        )}
      </div>

    </div>
  )
}
