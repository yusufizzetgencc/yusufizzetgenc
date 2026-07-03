"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
})

export async function registerUser(formData: FormData) {
  // formData'dan gelen değerleri güvenli bir şekilde string'e çeviriyoruz
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  })

  // 1. Zod Doğrulaması (Hata mesajını güvenli okuma)
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0]?.message || "Lütfen geçerli bilgiler giriniz.",
      success: false
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    // 2. E-posta kullanımda mı kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        error: "Bu e-posta adresi zaten kullanımda.",
        success: false
      }
    }

    // 3. Şifreyi Hash'leme
    const passwordHash = await bcrypt.hash(password, 10)

    // 4. Veritabanına kaydetme
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      }
    })

    return { success: true }
    
  } catch (error) {
    return {
      error: "Kayıt işlemi sırasında beklenmeyen bir hata oluştu.",
      success: false
    }
  }
}