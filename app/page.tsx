import Link from "next/link"
import { ArrowRight, Code, Server, Cloud, Smartphone } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/* ================================================================
   PLACEHOLDER VERİ — Database bağlantısı olmadan statik
   İleride bu veriler Prisma sorguları ile gelecek
   ================================================================ */

const latestPosts = [
  {
    id: "1",
    title: "Modern Frontend Geliştirmede State Yönetimi",
    excerpt:
      "React uygulamalarında state yönetiminin evrimi, Context API'den Zustand'a kadar farklı yaklaşımları ve ne zaman hangisini tercih etmeniz gerektiğini inceliyoruz.",
    slug: "modern-frontend-state-yonetimi",
    publishedAt: "28 Haziran 2026",
  },
  {
    id: "2",
    title: "PostgreSQL Performans İpuçları: Sorgu Optimizasyonu",
    excerpt:
      "Yavaş çalışan veritabanı sorgularınızı hızlandırmak için index stratejileri, EXPLAIN ANALYZE kullanımı ve yaygın performans tuzaklarından kaçınma yöntemleri.",
    slug: "postgresql-performans-ipuclari",
    publishedAt: "22 Haziran 2026",
  },
  {
    id: "3",
    title: "Next.js 15 ile Full-Stack Uygulama Geliştirme",
    excerpt:
      "Server Components, Server Actions ve App Router kullanarak sıfırdan production-ready bir uygulama nasıl oluşturulur? Adım adım rehber.",
    slug: "nextjs-15-fullstack-rehber",
    publishedAt: "15 Haziran 2026",
  },
]

const roadmapCategories = [
  {
    id: "1",
    title: "Frontend",
    slug: "frontend",
    description: "HTML, CSS, JavaScript, React ve modern frontend ekosistemi",
    icon: Code,
    topicCount: 24,
  },
  {
    id: "2",
    title: "Backend",
    slug: "backend",
    description: "Node.js, API tasarımı, veritabanları ve sunucu mimarisi",
    icon: Server,
    topicCount: 18,
  },
  {
    id: "3",
    title: "DevOps",
    slug: "devops",
    description: "Docker, CI/CD, bulut servisleri ve deployment stratejileri",
    icon: Cloud,
    topicCount: 12,
  },
  {
    id: "4",
    title: "Mobil Geliştirme",
    slug: "mobil-gelistirme",
    description: "React Native, Flutter ve cross-platform uygulama geliştirme",
    icon: Smartphone,
    topicCount: 15,
  },
]

/* ================================================================
   ANA SAYFA
   ================================================================ */

export default function HomePage() {
  return (
    <>
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-6 font-normal">
              Yazılım & Teknoloji
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Merhaba, ben{" "}
              <span className="text-primary">Yusuf İzzet</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Yazılım geliştirici, içerik üreticisi ve sürekli öğrenen biri.
              Bu platformda yazılım yolculuğumu, öğrendiklerimi ve projelerimi
              paylaşıyorum. Birlikte öğrenelim.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
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

      {/* ───── SON YAZILAR ───── */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Son Yazılar
              </h2>
              <p className="mt-2 text-muted-foreground">
                En son yayınlanan blog yazılarım
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
            >
              Tümünü Gör
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full transition-colors hover:border-primary/20 hover:bg-card/80">
                  <CardHeader>
                    <p className="text-xs font-medium text-muted-foreground">
                      {post.publishedAt}
                    </p>
                    <CardTitle className="mt-1.5 text-lg leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <span className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Devamını Oku →
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

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
      <section>
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Yol Haritaları
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
              Adım adım ilerleyebileceğin, konu anlatımlı ve videolu
              interaktif yol haritaları
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roadmapCategories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.id}
                  href={`/roadmap/${category.slug}`}
                  className="group"
                >
                  <Card className="h-full text-center transition-all hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="pt-8 pb-6">
                      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="font-semibold">{category.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                      <p className="mt-3 text-xs font-medium text-primary">
                        {category.topicCount} konu
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
