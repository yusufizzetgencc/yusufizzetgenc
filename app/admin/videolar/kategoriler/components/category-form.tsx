"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createVideoCategory } from "../../actions"

export function CategoryForm() {
  const [state, formAction, isPending] = useActionState(createVideoCategory, {
    message: null,
    errors: {},
  })

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.message && (
        <div className={`rounded-md p-3 text-sm ${state.success ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
          {state.message}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="title">Başlık</Label>
        <Input id="title" name="title" placeholder="Örn. Frontend Dersleri" />
        {state.errors?.title && (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input id="slug" name="slug" placeholder="orn-frontend-dersleri" />
        {state.errors?.slug && (
          <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Sıralama</Label>
        <Input id="order" name="order" type="number" defaultValue={0} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Ekleniyor..." : "Kategori Ekle"}
      </Button>
    </form>
  )
}
