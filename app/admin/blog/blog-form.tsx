"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { createPost, updatePost, type PostFormState } from "./actions"
import { useState, useEffect } from "react"

// Slugify helper
function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-ve-") // Replace & with 've'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
}

interface BlogFormProps {
  post?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    coverImage: string | null
    published: boolean
  } | null
}

export function BlogForm({ post }: BlogFormProps) {
  const [content, setContent] = useState(post?.content || "")
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  
  // Title değiştiğinde otomatik slug üret (eğer form yeni oluşturuluyorsa veya slug boşsa)
  useEffect(() => {
    if (!post && title && !slug) {
      setSlug(generateSlug(title))
    }
  }, [title, post, slug])

  const action = post
    ? updatePost.bind(null, post.id)
    : createPost

  const [state, formAction, isPending] = useActionState(action, {
    message: null,
    errors: {},
  })

  return (
    <form action={formAction} className="space-y-8">
      {state?.errors?._form && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {state.errors._form[0]}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Başlık</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yazı başlığı"
          />
          {state?.errors?.title && (
            <p className="text-xs text-destructive">{state.errors.title[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="yazi-basligi"
          />
          {state?.errors?.slug && (
            <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Kısa Özet</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt || ""}
          placeholder="Yazının kısa bir özeti..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Kapak Görseli URL (Opsiyonel)</Label>
        <Input
          id="coverImage"
          name="coverImage"
          defaultValue={post?.coverImage || ""}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">İçerik</Label>
        {/* Gizli input, form gönderildiğinde içeriği yollamak için */}
        <input type="hidden" name="content" value={content} />
        <TiptapEditor value={content} onChange={setContent} />
        {state?.errors?.content && (
          <p className="text-xs text-destructive">{state.errors.content[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          value="true"
          defaultChecked={post?.published || false}
          className="size-4 rounded border-border text-primary focus:ring-primary"
        />
        <Label htmlFor="published">Hemen Yayınla</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isPending}
        >
          İptal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : post ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  )
}
