import { BlogForm } from "../blog-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewBlogPostPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Yeni Yazı</h1>
          <p className="mt-1 text-muted-foreground">
            Blog için yeni bir içerik oluşturun.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <BlogForm />
      </div>
    </div>
  )
}
