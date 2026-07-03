"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createRoadmap } from "../actions"
import { Plus } from "lucide-react"

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

interface RoadmapDialogProps {
  categories: { id: string; title: string }[]
}

export function RoadmapDialog({ categories }: RoadmapDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  
  useEffect(() => {
    if (title && !slug) {
      setSlug(generateSlug(title))
    }
  }, [title, slug])

  const [state, formAction, isPending] = useActionState(createRoadmap, {
    message: null,
    errors: {},
    success: false,
  })

  useEffect(() => {
    if (state?.success) {
      setOpen(false)
      setTitle("")
      setSlug("")
    }
  }, [state?.success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="secondary" />}>
        <Plus className="mr-2 size-4" />
        Roadmap Ekle
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Yol Haritası</DialogTitle>
          <DialogDescription>
            Belirli bir kategori altına yeni bir yol haritası (roadmap) ekleyin.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {state?.errors?._form && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.errors._form[0]}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="categoryId">Kategori</Label>
            <select
              id="categoryId"
              name="categoryId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue={categories[0]?.id || ""}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {state?.errors?.categoryId && (
              <p className="text-xs text-destructive">{state.errors.categoryId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn. Frontend Geliştirici"
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
              placeholder="frontend-gelistirici"
            />
            {state?.errors?.slug && (
              <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Yol haritası hakkında kısa bilgi..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Sıra (Opsiyonel)</Label>
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue="0"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Kaydediliyor..." : "Oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
