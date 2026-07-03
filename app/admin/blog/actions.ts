"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const postSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "İçerik gerekli"),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
})

export type PostFormState = {
  errors?: {
    title?: string[]
    slug?: string[]
    excerpt?: string[]
    content?: string[]
    coverImage?: string[]
    _form?: string[]
  }
  message?: string | null
}

export async function createPost(prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    published: formData.get("published") === "true",
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  const { title, slug, excerpt, content, coverImage, published } = validatedFields.data

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        published,
        publishedAt: published ? new Date() : null,
        authorId: session.user.id as string,
      },
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  redirect("/admin/blog")
}

export async function updatePost(
  id: string,
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { errors: { _form: ["Yetkisiz işlem"] } }
  }

  const validatedFields = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    published: formData.get("published") === "true",
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen eksik alanları doldurun.",
    }
  }

  const { title, slug, excerpt, content, coverImage, published } = validatedFields.data

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } })
    
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        published,
        publishedAt: published && !existingPost?.publishedAt ? new Date() : existingPost?.publishedAt,
      },
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return { errors: { slug: ["Bu slug zaten kullanılıyor."] } }
    }
    return { errors: { _form: ["Kayıt sırasında bir hata oluştu."] } }
  }

  revalidatePath("/admin/blog")
  revalidatePath(`/admin/blog/${id}`)
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
  redirect("/admin/blog")
}

export async function deletePost(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  await prisma.post.delete({
    where: { id },
  })

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
}
