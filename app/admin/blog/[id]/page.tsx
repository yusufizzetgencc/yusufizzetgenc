import { BlogForm } from "../blog-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditBlogPostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yazıyı Düzenle</h1>
          <p className="mt-1 text-muted-foreground">
            {post.title} başlıklı yazıyı düzenliyorsunuz.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <BlogForm post={post} />
      </div>
    </div>
  )
}
