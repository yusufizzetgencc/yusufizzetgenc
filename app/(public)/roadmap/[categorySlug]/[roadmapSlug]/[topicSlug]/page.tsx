import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, ArrowRight, ChevronRight, ExternalLink, PlayCircle, BookOpen } from "lucide-react"

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
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16 page-enter">
      
      {/* Üst Kısım: Breadcrumb & Başlık */}
      <header className="mb-10">
        <nav className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/30 w-fit px-4 py-2 rounded-full border border-border/50">
          <Link href={`/roadmap/${categorySlug}`} className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <BookOpen className="size-4" />
            {roadmap.category.title}
          </Link>
          <ChevronRight className="size-3.5 opacity-50" />
          <Link href={`/roadmap/${categorySlug}#${roadmap.slug}`} className="hover:text-foreground transition-colors">
            {roadmap.title}
          </Link>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-500">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Bölüm {currentIndex + 1} / {roadmap.topics.length}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground leading-[1.1]">
              {topic.title}
            </h1>
          </div>

          {/* Harici Kaynak Butonu (varsa) */}
          {topic.externalUrl && (
            <Link 
              href={topic.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/25 active:scale-[0.98]"
            >
              <ExternalLink className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Derse Git (Dış Kaynak)
            </Link>
          )}
        </div>
      </header>

      {/* Ana İçerik Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">
        
        {/* Sol Kolon: Video ve Metin */}
        <div className="min-w-0">
          {/* Video Kısmı */}
          {embedUrl && (
            <div className="mb-12 overflow-hidden rounded-2xl border border-border/50 bg-black/5 shadow-2xl ring-1 ring-border/50">
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  title={topic.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <div className="bg-card px-4 py-3 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
                <PlayCircle className="size-4 text-red-500" />
                Video Ders
              </div>
            </div>
          )}

          {/* İçerik (Metin) Kısmı */}
          {topic.content ? (
            <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 md:p-10 shadow-sm">
              <div 
                className="prose prose-zinc dark:prose-invert max-w-none 
                prose-headings:tracking-tight prose-headings:font-bold
                prose-a:text-indigo-500 prose-a:no-underline hover:prose-a:underline 
                prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-1 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
                prose-code:text-indigo-500 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/50
                prose-img:rounded-xl prose-img:border prose-img:border-border/50"
                dangerouslySetInnerHTML={{ __html: topic.content }}
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/60 bg-muted/30 p-12 text-center text-muted-foreground">
              Bu konu için yazılı bir içerik bulunmuyor.
            </div>
          )}
        </div>

        {/* Sağ Kolon: Sıradaki Konular (Sidebar) */}
        <aside className="sticky top-24 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm hidden lg:block">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-lg">
            <BookOpen className="size-5 text-indigo-500" />
            Bölüm İçeriği
          </h3>
          <div className="space-y-1 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border/60">
            {roadmap.topics.map((t, index) => {
              const isActive = t.slug === topic.slug
              const isPast = index < currentIndex
              
              return (
                <Link
                  key={t.id}
                  href={`/roadmap/${categorySlug}/${roadmapSlug}/${t.slug}`}
                  className={`relative flex items-center gap-3 py-2 pl-8 transition-colors ${
                    isActive ? "text-indigo-500 font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Timeline Noktası */}
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background transition-colors ${
                    isActive ? "border-indigo-500 text-indigo-500 scale-110" : 
                    isPast ? "border-muted-foreground/30 bg-muted/50" : "border-border"
                  }`}>
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  </div>
                  
                  <span className="truncate text-sm">{t.title}</span>
                </Link>
              )
            })}
          </div>
        </aside>
      </div>

      {/* Alt Navigasyon (Önceki - Sonraki Butonları) */}
      <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-stretch justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/roadmap/${categorySlug}/${roadmapSlug}/${prevTopic.slug}`}
            className="group flex w-full sm:w-[48%] items-center gap-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all hover:border-border hover:bg-muted/50 hover:shadow-sm"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-background group-hover:shadow-sm border border-transparent group-hover:border-border/50">
              <ArrowLeft className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Önceki Ders</div>
              <div className="font-bold text-foreground truncate">{prevTopic.title}</div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block sm:w-[48%]" />
        )}

        {nextTopic && (
          <Link
            href={`/roadmap/${categorySlug}/${roadmapSlug}/${nextTopic.slug}`}
            className="group flex w-full sm:w-[48%] items-center justify-end gap-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:shadow-sm text-right"
          >
            <div className="text-right min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-500/70 mb-1">Sıradaki Ders</div>
              <div className="font-bold text-indigo-600 dark:text-indigo-400 truncate">{nextTopic.title}</div>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 transition-colors group-hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 group-hover:text-white shadow-sm border border-indigo-500/20 group-hover:border-transparent">
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        )}
      </div>

    </div>
  )
}
