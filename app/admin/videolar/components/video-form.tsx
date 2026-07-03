"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createVideo, updateVideo, type VideoFormState } from "../actions"

interface VideoFormProps {
  video?: {
    id: string
    title: string
    youtubeUrl: string
    description: string | null
    published: boolean
    order: number
  } | null
}

export function VideoForm({ video }: VideoFormProps) {
  const action = video
    ? updateVideo.bind(null, video.id)
    : createVideo

  const [state, formAction, isPending] = useActionState(action, {
    message: null,
    errors: {},
  })

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {state?.errors?._form && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {state.errors._form[0]}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Video Başlığı</Label>
        <Input
          id="title"
          name="title"
          defaultValue={video?.title || ""}
          placeholder="Örn. Next.js App Router İncelemesi"
        />
        {state?.errors?.title && (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtubeUrl">YouTube Linki</Label>
        <Input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          defaultValue={video?.youtubeUrl || ""}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {state?.errors?.youtubeUrl && (
          <p className="text-xs text-destructive">{state.errors.youtubeUrl[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={video?.description || ""}
          placeholder="Video hakkında kısa bir açıklama..."
          rows={3}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            className="size-4 rounded border-gray-300"
            defaultChecked={video ? video.published : true}
          />
          <Label htmlFor="published">Ana Sayfada Göster (Yayınla)</Label>
        </div>

        <div className="space-y-2 flex items-center gap-4">
          <Label htmlFor="order" className="whitespace-nowrap">Sıralama:</Label>
          <Input
            id="order"
            name="order"
            type="number"
            className="w-24"
            defaultValue={video?.order || 0}
          />
        </div>
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
          {isPending ? "Kaydediliyor..." : video ? "Güncelle" : "Ekle"}
        </Button>
      </div>
    </form>
  )
}
