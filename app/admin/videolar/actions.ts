"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const videoSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  youtubeUrl: z.string().url("Geçerli bir URL girin"),
  description: z.string().optional(),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().default(0),
  categoryId: z.string().optional().transform(val => (val === "" || val === "none" ? null : val)),
})

export type VideoFormState = {
  errors?: {
    title?: string[]
    youtubeUrl?: string[]
    description?: string[]
    published?: string[]
    order?: string[]
    _form?: string[]
  }
  message?: string | null
}

export async function createVideo(prevState: VideoFormState, formData: FormData): Promise<VideoFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = videoSchema.safeParse({
    title: formData.get("title"),
    youtubeUrl: formData.get("youtubeUrl"),
    description: formData.get("description"),
    published: formData.get("published") === "true" || formData.get("published") === "on",
    order: formData.get("order"),
    categoryId: formData.get("categoryId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen alanları kontrol edin.",
    }
  }

  try {
    await prisma.video.create({
      data: validatedFields.data,
    })
  } catch (error: any) {
    return { errors: { _form: ["Kayıt sırasında hata oluştu."] } }
  }

  revalidatePath("/admin/videolar")
  revalidatePath("/")
  redirect("/admin/videolar")
}

export async function updateVideo(
  id: string,
  prevState: VideoFormState,
  formData: FormData
): Promise<VideoFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = videoSchema.safeParse({
    title: formData.get("title"),
    youtubeUrl: formData.get("youtubeUrl"),
    description: formData.get("description"),
    published: formData.get("published") === "true" || formData.get("published") === "on",
    order: formData.get("order"),
    categoryId: formData.get("categoryId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen alanları kontrol edin.",
    }
  }

  try {
    await prisma.video.update({
      where: { id },
      data: validatedFields.data,
    })
  } catch (error: any) {
    return { errors: { _form: ["Güncelleme sırasında hata oluştu."] } }
  }

  revalidatePath("/admin/videolar")
  revalidatePath("/")
  redirect("/admin/videolar")
}

export async function deleteVideo(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  await prisma.video.delete({
    where: { id },
  })

  revalidatePath("/admin/videolar")
  revalidatePath("/")
}

// ─── VIDEO CATEGORY ACTIONS ─────────────────────────────────────────────

const categorySchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  order: z.coerce.number().default(0),
})

export type VideoCategoryFormState = {
  errors?: {
    title?: string[]
    slug?: string[]
    order?: string[]
    _form?: string[]
  }
  message?: string | null
  success?: boolean
}

export async function createVideoCategory(prevState: VideoCategoryFormState, formData: FormData): Promise<VideoCategoryFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = categorySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    order: formData.get("order"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  try {
    await prisma.videoCategory.create({
      data: validatedFields.data,
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }

  revalidatePath("/admin/videolar/kategoriler")
  revalidatePath("/youtube")
  return { success: true, message: "Kategori oluşturuldu." }
}

export async function deleteVideoCategory(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem")
  }
  
  await prisma.video.updateMany({
    where: { categoryId: id },
    data: { categoryId: null }
  })

  await prisma.videoCategory.delete({ where: { id } })
  
  revalidatePath("/admin/videolar/kategoriler")
  revalidatePath("/youtube")
}

