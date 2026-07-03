import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma"

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com"
  const password = process.env.ADMIN_PASSWORD || "password123"

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log(`Admin kullanıcısı (${email}) zaten mevcut.`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  })

  console.log("Admin kullanıcısı başarıyla oluşturuldu:")
  console.log(`Email: ${admin.email}`)
  console.log(`Şifre: ${password}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
