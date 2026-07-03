import Link from "next/link"
import { ArrowRight, Code, Server, Cloud, Smartphone, Map, PlayCircle } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

// YouTube URL'sinden embed linkini çıkaran yardımcı fonksiyon
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }
  return null
}

const CategoryIcon = ({ iconName }: { iconName: string | null }) => {
  const icons: Record<string, React.ElementType> = {
    Code, Server, Cloud, Smartphone, Map
  }
  const Icon = iconName && icons[iconName] ? icons[iconName] : Map
  return <Icon className="size-6" />
}

export default async function HomePage() {
  // Gerçek verileri veritabanından çekiyoruz
  const [latestPosts, categories, latestVideos] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { roadmaps: true }
        }
      }
    }),
    prisma.video.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 2,
    })
  ])

  return (
    <>
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        {/* Dot pattern arka plan */}
        <div className="subtle-grid pointer-events-none absolute inset-0 -z-10" />
        {/* Gradient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/[0.04] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-28 sm:px-6 sm:py-36 lg:py-44">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="animate-in mb-8 gap-1.5 px-3 py-1 font-normal">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary" />
              Yazılım & Teknoloji
            </Badge>
            <h1 className="animate-in-delay-1 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Merhaba, ben{" "}
              <span className="text-primary">Yusuf İzzet</span>
            </h1>
            <p className="animate-in-delay-2 mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Yazılım geliştirici, içerik üreticisi ve sürekli öğrenen biri.
              Bu platformda yazılım yolculuğumu, öğrendiklerimi ve projelerimi
              paylaşıyorum. Birlikte öğrenelim.
            </p>
            <div className="animate-in-delay-3 mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/roadmap" className={buttonVariants({ size: "lg" })}>
                Roadmap&apos;i Keşfet
                <ArrowRight className="ml-1.5 size-4" data-icon="inline-end" />
              </Link>
              <Link href="/blog" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Blog&apos;u Oku
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── YOUTUBE VİDEOLARI ───── */}
      {latestVideos.length > 0 && (
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-red-500/10">
                    <PlayCircle className="text-red-500 size-5" />
                  </div>
                  YouTube Videolarım
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Yazılım, kariyer ve teknoloji üzerine son videolarım
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {latestVideos.map((video) => {
                const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl)
                return (
                  <div key={video.id} className="group flex flex-col gap-3">
                    {embedUrl ? (
                      <div className="overflow-hidden rounded-xl border border-border shadow-sm aspect-video transition-shadow group-hover:shadow-md">
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-xl bg-muted border border-border">
                        Geçersiz Video Linki
                      </div>
                    )}
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───── SON YAZILAR ───── */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Son Yazılar
              </h2>
              <p className="mt-3 text-muted-foreground">
                En son yayınlanan blog yazılarım
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
            >
              Tümünü Gör
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {latestPosts.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground">Henüz blog yazısı yayınlanmamış.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <Card className="lift h-full transition-colors hover:border-primary/20">
                    {/* Dekoratif üst şerit */}
                    <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-t-xl" />
                    <CardHeader>
                      <p className="text-xs font-medium text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <CardTitle className="mt-2 text-lg leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Devamını Oku
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/blog"
            className="mt-8 flex items-center justify-center gap-1 text-sm font-medium text-primary sm:hidden"
          >
            Tümünü Gör
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* ───── YOL HARİTALARI ───── */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Yol Haritaları
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Adım adım ilerleyebileceğin, konu anlatımlı ve videolu
              interaktif yol haritaları
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
              <Map className="mb-3 size-8 text-muted-foreground/40" />
              <p className="text-muted-foreground">Henüz yol haritası kategorisi eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => {
                return (
                  <Link
                    key={category.id}
                    href={`/roadmap/${category.slug}`}
                    className="group"
                  >
                    <Card className="lift h-full text-center transition-all hover:border-primary/20">
                      <CardContent className="pt-8 pb-6">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                          <CategoryIcon iconName={category.icon} />
                        </div>
                        <h3 className="font-semibold">{category.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {category.description}
                        </p>
                        <p className="mt-3 text-xs font-medium text-primary">
                          {category._count.roadmaps} yol haritası
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
