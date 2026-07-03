import { defineConfig } from "@prisma/config"

export default defineConfig({
  migrate: {
    // Veritabanına tabloları göndermek (push/migrate) için DIRECT_URL (5432 portu) kullanılır
    url: process.env.DIRECT_URL,
  },
})