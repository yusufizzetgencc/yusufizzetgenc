import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"

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

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mb-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Blog&apos;a Dön
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="size-4" />
            <span>{post.author.name || "Yazar"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt?.toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
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
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
