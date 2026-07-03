"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

// ─── KATEGORİ İŞLEMLERİ ──────────────────────────────────────────────

const categorySchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.coerce.number().default(0),
})

export type CategoryFormState = {
  errors?: {
    title?: string[]
    slug?: string[]
    description?: string[]
    icon?: string[]
    order?: string[]
    _form?: string[]
  }
  message?: string | null
  success?: boolean
}

export async function createCategory(prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = categorySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    order: formData.get("order"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  try {
    await prisma.category.create({
      data: validatedFields.data,
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }

  revalidatePath("/admin/roadmap")
  return { success: true, message: "Kategori oluşturuldu." }
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem")
  }
  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/roadmap")
}


// ─── ROADMAP İŞLEMLERİ ───────────────────────────────────────────────

const roadmapSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Kategori seçimi zorunlu"),
  order: z.coerce.number().default(0),
})

export type RoadmapFormState = {
  errors?: {
    title?: string[]
    slug?: string[]
    description?: string[]
    categoryId?: string[]
    order?: string[]
    _form?: string[]
  }
  message?: string | null
  success?: boolean
}

export async function createRoadmap(prevState: RoadmapFormState, formData: FormData): Promise<RoadmapFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = roadmapSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    order: formData.get("order"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  try {
    await prisma.roadmap.create({
      data: validatedFields.data,
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }

  revalidatePath("/admin/roadmap")
  return { success: true, message: "Yol haritası oluşturuldu." }
}

export async function deleteRoadmap(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem")
  }
  await prisma.roadmap.delete({ where: { id } })
  revalidatePath("/admin/roadmap")
}


// ─── KONU (TOPIC) İŞLEMLERİ ───────────────────────────────────────────

const topicSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  content: z.string().min(1, "İçerik gerekli"),
  videoUrl: z.string().optional(),
  roadmapId: z.string().min(1, "Yol haritası (Roadmap) gerekli"),
  order: z.coerce.number().default(0),
})

export type TopicFormState = {
  errors?: {
    title?: string[]
    slug?: string[]
    content?: string[]
    videoUrl?: string[]
    roadmapId?: string[]
    order?: string[]
    _form?: string[]
  }
  message?: string | null
  success?: boolean
  topicId?: string
}

export async function createTopic(prevState: TopicFormState, formData: FormData): Promise<TopicFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const roadmapId = formData.get("roadmapId") as string

  const validatedFields = topicSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    videoUrl: formData.get("videoUrl"),
    roadmapId,
    order: formData.get("order"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  try {
    const topic = await prisma.topic.create({
      data: validatedFields.data,
    })
    revalidatePath(`/admin/roadmap/${roadmapId}`)
    return { success: true, message: "Konu oluşturuldu.", topicId: topic.id }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug, bu roadmap için zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }
}

export async function updateTopic(id: string, prevState: TopicFormState, formData: FormData): Promise<TopicFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const roadmapId = formData.get("roadmapId") as string

  const validatedFields = topicSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    videoUrl: formData.get("videoUrl"),
    roadmapId,
    order: formData.get("order"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  try {
    await prisma.topic.update({
      where: { id },
      data: validatedFields.data,
    })
    revalidatePath(`/admin/roadmap/${roadmapId}`)
    return { success: true, message: "Konu güncellendi." }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug, bu roadmap için zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }
}

export async function deleteTopic(id: string, roadmapId: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem")
  }
  await prisma.topic.delete({ where: { id } })
  revalidatePath(`/admin/roadmap/${roadmapId}`)
}
