import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import { PlayCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "YouTube Videolarım",
  description: "Yazılım, kariyer ve teknoloji üzerine çektiğim YouTube videoları.",
}

// YouTube URL'sinden video ID'sini çıkaran yardımcı fonksiyon
function getYoutubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export default async function YouTubePage() {
  const categories = await prisma.videoCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      videos: {
        where: { published: true },
        orderBy: { order: "asc" },
      },
    },
  })

  const uncategorizedVideos = await prisma.video.findMany({
    where: { categoryId: null, published: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          YouTube <span className="text-primary">Videolarım</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Yazılım geliştirme, ipuçları ve teknoloji kariyeri üzerine hazırladığım video içerikleri.
        </p>
      </div>

      <div className="space-y-16">
        {/* Kategorize Edilmiş Videolar */}
        {categories.map(
          (category) =>
            category.videos.length > 0 && (
              <section key={category.id} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                  <h2 className="text-2xl font-bold tracking-tight">{category.title}</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.videos.map((video) => {
                    const videoId = getYoutubeVideoId(video.youtubeUrl)
                    const thumbnailUrl = videoId
                      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                      : "/placeholder.png"

                    return (
                      <a
                        key={video.id}
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all hover:bg-card hover:shadow-xl"
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbnailUrl}
                            alt={video.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                            <PlayCircle className="size-12 text-white shadow-sm" />
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                            {video.title}
                          </h3>
                          {video.description && (
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </a>
                    )
                  })}
                </div>
              </section>
            )
        )}

        {/* Kategorisiz Videolar (Diğer) */}
        {uncategorizedVideos.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-2">
              <h2 className="text-2xl font-bold tracking-tight">Diğer Videolar</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uncategorizedVideos.map((video) => {
                const videoId = getYoutubeVideoId(video.youtubeUrl)
                const thumbnailUrl = videoId
                  ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                  : "/placeholder.png"

                return (
                  <a
                    key={video.id}
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all hover:bg-card hover:shadow-xl"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <PlayCircle className="size-12 text-white shadow-sm" />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
