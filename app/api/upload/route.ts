import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adını temizle ve benzersiz yap
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, "_")
    const filename = `${uniqueSuffix}-${originalName}`

    const uploadDir = join(process.cwd(), "public", "uploads")
    
    // Klasör yoksa oluştur
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Klasör zaten varsa hata verme
    }

    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error("Yükleme hatası:", error)
    return NextResponse.json(
      { error: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
