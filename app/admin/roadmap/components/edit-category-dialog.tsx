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
import { updateCategory } from "../actions"
import { Edit2 } from "lucide-react"
import { Category } from "@prisma/client"

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

interface EditCategoryDialogProps {
  category: Category
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(category.title)
  const [slug, setSlug] = useState(category.slug)
  
  // We bind the category ID to the server action
  const updateCategoryWithId = updateCategory.bind(null, category.id)
  
  const [state, formAction, isPending] = useActionState(updateCategoryWithId, {
    message: null,
    errors: {},
    success: false,
  })

  useEffect(() => {
    if (state?.success) {
      setOpen(false)
    }
  }, [state?.success])

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setTitle(category.title)
      setSlug(category.slug)
    }
  }, [open, category])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Kategoriyi Düzenle"
        >
          <Edit2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <DialogTitle>Kategoriyi Düzenle</DialogTitle>
          <DialogDescription>
            Kategori bilgilerini güncelleyin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto p-6 flex-1">
          <form id={`edit-category-form-${category.id}`} action={formAction} className="space-y-4">
            {state?.errors?._form && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {state.errors._form[0]}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor={`title-${category.id}`}>Başlık</Label>
              <Input
                id={`title-${category.id}`}
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setSlug(generateSlug(e.target.value))
                }}
                placeholder="Örn. Frontend"
              />
              {state?.errors?.title && (
                <p className="text-xs text-destructive">{state.errors.title[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`slug-${category.id}`}>URL Slug</Label>
              <Input
                id={`slug-${category.id}`}
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="frontend"
              />
              {state?.errors?.slug && (
                <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${category.id}`}>Açıklama (Opsiyonel)</Label>
              <Textarea
                id={`description-${category.id}`}
                name="description"
                defaultValue={category.description || ""}
                placeholder="Kategori hakkında kısa bilgi..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`icon-${category.id}`}>İkon (Lucide-react, Opsiyonel)</Label>
              <Input
                id={`icon-${category.id}`}
                name="icon"
                defaultValue={category.icon || ""}
                placeholder="Örn. Code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`order-${category.id}`}>Sıra (Opsiyonel)</Label>
              <Input
                id={`order-${category.id}`}
                name="order"
                type="number"
                defaultValue={category.order}
              />
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-2 p-6 pt-4 border-t shrink-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            İptal
          </Button>
          <Button type="submit" form={`edit-category-form-${category.id}`} disabled={isPending}>
            {isPending ? "Kaydediliyor..." : "Güncelle"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
