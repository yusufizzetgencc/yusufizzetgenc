"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { createProject, updateProject, type ProjectFormState } from "../actions"

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

interface ProjectFormProps {
  project?: {
    id: string
    title: string
    slug: string
    description: string
    content: string | null
    coverImage: string | null
    liveUrl: string | null
    githubUrl: string | null
    order: number
  } | null
}

export function ProjectForm({ project }: ProjectFormProps) {
  const [content, setContent] = useState(project?.content || "")
  const [title, setTitle] = useState(project?.title || "")
  const [slug, setSlug] = useState(project?.slug || "")
  
  useEffect(() => {
    if (!project && title && !slug) {
      setSlug(generateSlug(title))
    }
  }, [title, project, slug])

  const action = project
    ? updateProject.bind(null, project.id)
    : createProject

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
          <Label htmlFor="title">Proje Başlığı</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn. E-Ticaret Platformu"
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
            placeholder="e-ticaret-platformu"
          />
          {state?.errors?.slug && (
            <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Kısa Açıklama (Özet)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description || ""}
          placeholder="Projenin amacı ve kullandığınız teknolojiler..."
          rows={3}
        />
        {state?.errors?.description && (
          <p className="text-xs text-destructive">{state.errors.description[0]}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Canlı Site Linki (Opsiyonel)</Label>
          <Input
            id="liveUrl"
            name="liveUrl"
            defaultValue={project?.liveUrl || ""}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub Kaynak Linki (Opsiyonel)</Label>
          <Input
            id="githubUrl"
            name="githubUrl"
            defaultValue={project?.githubUrl || ""}
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="coverImage">Kapak Görseli URL (Opsiyonel)</Label>
          <Input
            id="coverImage"
            name="coverImage"
            defaultValue={project?.coverImage || ""}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Sıralama (Opsiyonel)</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={project?.order || 0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Detaylı İçerik (Opsiyonel)</Label>
        {/* Gizli input, form gönderildiğinde içeriği yollamak için */}
        <input type="hidden" name="content" value={content} />
        <TiptapEditor value={content} onChange={setContent} />
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
          {isPending ? "Kaydediliyor..." : project ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  )
}
