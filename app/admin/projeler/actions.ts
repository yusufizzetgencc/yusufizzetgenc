"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const projectSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  order: z.coerce.number().default(0),
})

export type ProjectFormState = {
  errors?: {
    title?: string[]
    slug?: string[]
    description?: string[]
    content?: string[]
    coverImage?: string[]
    liveUrl?: string[]
    githubUrl?: string[]
    order?: string[]
    _form?: string[]
  }
  message?: string | null
}

export async function createProject(prevState: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    liveUrl: formData.get("liveUrl"),
    githubUrl: formData.get("githubUrl"),
    order: formData.get("order"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  try {
    await prisma.project.create({
      data: validatedFields.data,
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }

  revalidatePath("/admin/projeler")
  revalidatePath("/admin")
  redirect("/admin/projeler")
}

export async function updateProject(
  id: string,
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    liveUrl: formData.get("liveUrl"),
    githubUrl: formData.get("githubUrl"),
    order: formData.get("order"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  try {
    await prisma.project.update({
      where: { id },
      data: validatedFields.data,
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }

  revalidatePath("/admin/projeler")
  revalidatePath(`/admin/projeler/${id}`)
  revalidatePath("/admin")
  redirect("/admin/projeler")
}

export async function deleteProject(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  await prisma.project.delete({
    where: { id },
  })

  revalidatePath("/admin/projeler")
  revalidatePath("/admin")
}
