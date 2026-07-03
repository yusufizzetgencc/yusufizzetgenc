import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, ChevronRight } from "lucide-react"

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  })

  // Yazı yoksa veya taslak halindeyse 404 döndür
  if (!post || !post.published) {
    notFound()
  }

  // Basit okuma süresi tahmini
  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24 page-enter">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Anasayfa</Link>
        <ChevronRight className="size-3" />
        <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <ChevronRight className="size-3" />
        <span className="truncate text-foreground/80">{post.title}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6 leading-[1.15]">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-primary/10">
              <User className="size-3.5 text-primary" />
            </div>
            <span>{post.author.name || "Yazar"}</span>
          </div>
          <span className="text-border">·</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt?.toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <span className="text-border">·</span>
          <span>{readingMinutes} dk okuma</span>
        </div>
      </div>

      {post.coverImage && (
        <div className="mb-12 overflow-hidden rounded-xl bg-muted/50 border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full object-cover object-center max-h-[500px]"
          />
        </div>
      )}

      {/* Tiptap HTML içeriğini güvenli bir şekilde render etme */}
      {/* Tailwind Typography plugin (.prose) burada devreye giriyor */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-p:leading-relaxed prose-blockquote:border-primary/30 prose-blockquote:not-italic"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Alt navigasyon */}
      <div className="mt-16 pt-8 border-t border-border/40">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Tüm Yazılara Dön
        </Link>
      </div>
    </article>
  )
}
