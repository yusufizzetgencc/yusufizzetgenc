"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { createTopic, updateTopic } from "../actions"
import { useRouter } from "next/navigation"

// Slugify helper
function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-ve-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
}

interface TopicFormProps {
  roadmapId: string
  topic?: {
    id: string
    title: string
    slug: string
    content: string
    videoUrl: string | null
    order: number
  } | null
}

export function TopicForm({ roadmapId, topic }: TopicFormProps) {
  const router = useRouter()
  const [content, setContent] = useState(topic?.content || "")
  const [title, setTitle] = useState(topic?.title || "")
  const [slug, setSlug] = useState(topic?.slug || "")
  
  // Title değiştiğinde otomatik slug üret (eğer form yeni oluşturuluyorsa veya slug boşsa)
  useEffect(() => {
    if (!topic && title && !slug) {
      setSlug(generateSlug(title))
    }
  }, [title, topic, slug])

  const action = topic
    ? updateTopic.bind(null, topic.id)
    : createTopic

  const [state, formAction, isPending] = useActionState(action, {
    message: null,
    errors: {},
    success: false,
  })

  useEffect(() => {
    if (state?.success) {
      router.push(`/admin/roadmap/${roadmapId}`)
    }
  }, [state?.success, router, roadmapId])

  return (
    <form action={formAction} className="space-y-8">
      {/* Gizli input, roadmap id yollamak için */}
      <input type="hidden" name="roadmapId" value={roadmapId} />

      {state?.errors?._form && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {state.errors._form[0]}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Konu Başlığı</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="İnternet Nasıl Çalışır?"
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
            placeholder="internet-nasil-calisir"
          />
          {state?.errors?.slug && (
            <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="videoUrl">YouTube Video Linki (Opsiyonel)</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            defaultValue={topic?.videoUrl || ""}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="order">Sıra (Opsiyonel)</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={topic?.order || 0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">İçerik (Metin)</Label>
        {/* Gizli input, form gönderildiğinde içeriği yollamak için */}
        <input type="hidden" name="content" value={content} />
        <TiptapEditor value={content} onChange={setContent} />
        {state?.errors?.content && (
          <p className="text-xs text-destructive">{state.errors.content[0]}</p>
        )}
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
          {isPending ? "Kaydediliyor..." : topic ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  )
}
