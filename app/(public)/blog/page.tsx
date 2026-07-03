import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, BookOpen } from "lucide-react"

export default async function BlogListPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-24 page-enter">
      <div className="mb-14">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Yazılım geliştirme, teknoloji ve deneyimlerim üzerine yazılar.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
          <BookOpen className="mb-3 size-10 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">
            Henüz blog yazısı bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <Card className="lift h-full transition-colors hover:border-primary/20">
                {/* Dekoratif üst şerit */}
                <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-t-xl" />
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Calendar className="size-3" />
                    <time dateTime={post.publishedAt?.toISOString()}>
                      {post.publishedAt?.toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <CardTitle className="mt-2 text-xl leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                    Devamını Oku <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
