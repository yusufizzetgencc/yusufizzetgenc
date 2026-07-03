import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma"

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com"
  const password = process.env.ADMIN_PASSWORD || "password123"

  let admin = await prisma.user.findUnique({
    where: { email },
  })

  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10)
    admin = await prisma.user.create({
      data: {
        name: "Yusuf İzzet Genç",
        email,
        passwordHash,
        role: "ADMIN",
      },
    })
    console.log("Admin kullanıcısı başarıyla oluşturuldu:")
    console.log(`Email: ${admin.email}`)
    console.log(`Şifre: ${password}`)
  } else {
    console.log(`Admin kullanıcısı (${email}) zaten mevcut.`)
  }

  // --- SEED KATEGORİ VE ROADMAP ---
  console.log("Kategori ve Roadmap verileri ekleniyor...")
  
  const frontendCategory = await prisma.category.upsert({
    where: { slug: "frontend" },
    update: {},
    create: {
      title: "Frontend Geliştirme",
      slug: "frontend",
      description: "Modern web arayüzleri inşa etmek için gereken tüm teknolojiler.",
      icon: "Code",
      order: 1,
    }
  })

  const frontendRoadmap = await prisma.roadmap.upsert({
    where: { slug: "frontend-baslangic" },
    update: {},
    create: {
      title: "Frontend Başlangıç Yol Haritası",
      slug: "frontend-baslangic",
      description: "Sıfırdan ileri seviyeye Frontend geliştirici olmak için izlemeniz gereken yol.",
      categoryId: frontendCategory.id,
      order: 1,
    }
  })

  // Konuları ekle
  const topics = [
    {
      title: "İnternet Nasıl Çalışır?",
      slug: "internet-nasil-calisir",
      content: "<h2>İnternetin Temelleri</h2><p>İnternet, dünya çapında bilgisayar ağlarının birbirine bağlanmasıyla oluşan devasa bir iletişim ağıdır.</p><ul><li>DNS ve IP Adresleri</li><li>HTTP/HTTPS Protokolleri</li><li>Tarayıcılar nasıl çalışır?</li></ul>",
      videoUrl: "https://www.youtube.com/watch?v=7_LPdttKXPc",
      roadmapId: frontendRoadmap.id,
      order: 1
    },
    {
      title: "HTML5 Temelleri",
      slug: "html5-temelleri",
      content: "<h2>HTML5 Nedir?</h2><p>Web sayfalarının iskeletini oluşturmak için kullanılan işaretleme dilidir. Modern semantik tag'ler (header, footer, nav, article vb.) erişilebilirliği artırır.</p>",
      videoUrl: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
      roadmapId: frontendRoadmap.id,
      order: 2
    },
    {
      title: "CSS3 ve Modern Düzenler",
      slug: "css3-ve-modern-duzenler",
      content: "<h2>CSS Flexbox ve Grid</h2><p>Responsive tasarımlar yapabilmek için Flexbox ve Grid sistemlerini kavramak hayati öneme sahiptir.</p>",
      videoUrl: "",
      roadmapId: frontendRoadmap.id,
      order: 3
    }
  ]

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: {
        roadmapId_slug: {
          roadmapId: topic.roadmapId,
          slug: topic.slug,
        }
      },
      update: {},
      create: topic,
    })
  }

  // --- SEED BLOG YAZILARI ---
  console.log("Blog yazıları ekleniyor...")
  const posts = [
    {
      title: "Next.js 15 App Router: Yenilikler Neler?",
      slug: "nextjs-15-app-router-yenilikler",
      excerpt: "Next.js 15 ile gelen Server Components, Turbopack iyileştirmeleri ve caching mekanizmalarındaki değişikliklere yakından bakalım.",
      content: "<h2>App Router'ın Gücü</h2><p>Next.js 15 ile birlikte React'in en yeni özelliklerini (Server Actions, Suspense vb.) kullanmak çok daha akıcı hale geldi.</p><blockquote>Gelecek artık tamamen sunucu tarafında render edilen interaktif bileşenlerde.</blockquote><p>Bu makalede yeni veri çekme (data fetching) stratejilerini inceleyeceğiz.</p>",
      published: true,
      authorId: admin.id,
    },
    {
      title: "Neden Tailwind CSS Kullanıyorum?",
      slug: "neden-tailwind-css-kullaniyorum",
      excerpt: "Utility-first CSS yaklaşımının getirdiği üretkenlik artışı ve projelerde sağladığı bakım kolaylığı üzerine düşüncelerim.",
      content: "<h2>Utility-first Yaklaşım</h2><p>Eskiden her bileşen için ayrı ayrı BEM isimlendirmeleriyle uğraşırken, Tailwind CSS ile her şeyi doğrudan HTML içinde çözmek inanılmaz bir hız kazandırdı.</p><ul><li>İsimlendirme derdi yok</li><li>Stil dosyası şişmesi engelleniyor</li><li>Sıfır yapılandırmayla Dark Mode</li></ul>",
      published: true,
      authorId: admin.id,
    },
    {
      title: "Yazılım Geliştirmede AI Dönemi (Taslak)",
      slug: "yazilim-gelistirmede-ai-donemi",
      excerpt: "GitHub Copilot ve ChatGPT gibi yapay zeka araçlarının günlük yazılım süreçlerimize etkisi.",
      content: "<h2>Yapay Zeka Yardımcılar</h2><p>Artık kod yazarken yapay zeka araçlarından destek almamak, bir marangoza elektrikli testere kullanmamasını söylemek gibi bir şey.</p>",
      published: false,
      authorId: admin.id,
    }
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        publishedAt: post.published ? new Date() : null,
      },
    })
  }

  // --- SEED PROJELER ---
  console.log("Projeler ekleniyor...")
  const projects = [
    {
      title: "Kişisel Blog ve Eğitim Platformu",
      slug: "kisisel-blog-ve-egitim-platformu",
      description: "Şu anda incelediğiniz bu platform. Next.js 15, Tailwind CSS ve Prisma kullanılarak geliştirilmiştir.",
      content: "<h2>Projenin Amacı</h2><p>Kendi öğrendiklerimi paylaşmak ve yapılandırılmış eğitim yol haritaları sunmak için geliştirdiğim tamamen modern web teknolojileri ile inşa edilmiş bir sistem.</p>",
      liveUrl: "https://yusufizzetgenc.com",
      githubUrl: "https://github.com/yusufizzet/portfolio",
      order: 1
    },
    {
      title: "E-Ticaret Yönetim Paneli",
      slug: "e-ticaret-yonetim-paneli",
      description: "B2B e-ticaret firmaları için geliştirilmiş, stok takibi, sipariş yönetimi ve raporlama sunan kapsamlı SaaS çözümü.",
      content: "<h2>Kullanılan Teknolojiler</h2><ul><li>React & TypeScript</li><li>Redux Toolkit</li><li>Node.js & Express</li><li>PostgreSQL</li></ul><p>Dashboard üzerinde aylık gelir/gider tabloları, anlık stok değişimleri gibi kritik metrikler websocket ile anlık beslenmektedir.</p>",
      liveUrl: "",
      githubUrl: "https://github.com/yusufizzet/b2b-ecommerce-dashboard",
      order: 2
    }
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    })
  }

  console.log("Tüm seed verileri başarıyla eklendi!")
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
