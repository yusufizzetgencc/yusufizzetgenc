# Proje: Yusuf İzzet Genç — Kişisel Site / Blog / Roadmap Platformu

Bu dosya, projede çalışan Claude Code için kalıcı referans dosyasıdır. Her oturumda
önce bu dosyayı oku. Kod yazarken buradaki kurallara, mimariye ve tasarım diline sadık kal.
Belirsiz bir karar noktasında burada yazılana göre karar ver; yine de emin değilsen bana sor.

## 1. Projenin Amacı

Yusuf İzzet Genç'in kişisel sitesi. Üç ana işlevi var:

1. **Blog** — Yusuf'un yazdığı teknik/kişisel yazılar. Yönetim panelinden düzgün bir
   editörle (WYSIWYG, markdown değil) yazılıp yayınlanabilmeli.
2. **Roadmap / Kurs Bölümü** — roadmap.sh + w3schools karışımı bir yapı.
   Kategori (örn. "Frontend") → Roadmap (örn. "Frontend Yol Haritası") → Konu
   (örn. "İnternet Nasıl Çalışır?") hiyerarşisi. Her konu sayfasında hem yazılı
   anlatım hem de YouTube video embed'i olacak.
3. **Projeler / Tanıtım** — Yusuf'un kendi projelerinin sergilendiği bir bölüm
   (portfolyo niteliğinde).

İleride: kullanıcı üyeliği, reklam entegrasyonu, ardından reklamsız ücretli abonelik.
Ama bu aşamalar sonraki fazlar — şimdi sağlam bir temel kuruyoruz ki sonra baştan
yazmak zorunda kalmayalım.

## 2. Teknoloji Yığını (Kesin Kararlar — Değiştirme)

- **Framework:** Next.js 15 (App Router, TypeScript, Server Components varsayılan)
- **Stil:** Tailwind CSS + shadcn/ui bileşenleri
- **Veritabanı:** PostgreSQL (Supabase üzerinde barındırılacak)
- **ORM:** Prisma
- **Auth:** Auth.js (NextAuth v5) — email/şifre + ileride Google ile giriş
- **Zengin metin editörü:** Tiptap (admin panelinde blog/konu içeriği yazmak için)
- **Tema:** next-themes ile açık/koyu mod (sistem tercihini algılasın, manuel switch de olsun)
- **Görsel/dosya depolama:** Supabase Storage (kapak görselleri, küçük resimler için)
- **Deploy:** Vercel

Bu yığın dışına çıkma. Örneğin state management kütüphanesi (Redux vb.) ekleme,
gerekmiyor. Gereksiz paket ekleme — her paket eklemeden önce gerçekten gerekli mi diye düşün.

## 3. Tasarım Dili (ÇOK ÖNEMLİ)

Hedef his: **"Vay, ne güzel site" — "bu ne biçim site" değil.**
Yani sade ama premium. Göz yormayan, kendinden emin, gösterişsiz ama kaliteli.

- **Renk paleti:** Siyah/beyaz temelli + tek vurgu rengi olarak **indigo/mor**
  (örn. `#6366f1` — Tailwind'in `indigo-500` civarı). Vurgu rengi sadece önemli
  yerlerde kullanılsın: butonlar, linkler, aktif durumlar. Her yeri renklendirme.
- **Açık mod:** Kırık beyaz arka plan (`#fafafa` gibi, saf beyaz değil), koyu gri/siyah metin.
- **Koyu mod:** Saf siyah değil, çok koyu gri (`#0a0a0a` - `#111111` civarı) arka plan,
  kırık beyaz metin. Kontrastı göz yormayacak şekilde ayarla.
- **Tipografi:** Modern, okunaklı bir sans-serif (örn. Inter, Geist, ya da benzeri).
  Başlıklarda biraz daha karakterli bir font denenebilir ama abartma.
  Bol boşluk (whitespace) kullan — sıkışık görünmesin.
- **Bileşenler:** Keskin köşeler yerine hafif yuvarlatılmış (rounded-lg/xl), ince
  gölgeler, hover'da yumuşak geçişler (transition). shadcn/ui'nin default estetiği
  bu yöne zaten yakın, onu temel al ve üstüne özelleştir.
- **Kaçınılacaklar:** Parlak/doygun renk karmaşası, gereksiz animasyon/parıltı
  efektleri, stok görsel hissi veren illüstrasyonlar, kalabalık layout'lar,
  gradient'lerin her yere sürülmesi. "2026 SaaS landing page" klişesinden kaçın —
  sadelik esas, gösteriş değil.
- **Referans hissiyat:** Linear.app, Vercel.com, Stripe.com'un sadelik anlayışı gibi
  düşün — az öğe, çok nefes alanı, tutarlı tipografi hiyerarşisi.

## 4. Veri Modeli (Prisma Şeması — Taslak)

Aşağıdaki modeli temel al, gerekirse geliştir ama ana ilişkileri koru:

```prisma
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String   @unique
  passwordHash  String?
  image         String?
  role          Role     @default(USER)
  createdAt     DateTime @default(now())
  posts         Post[]
}

enum Role {
  USER
  ADMIN
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String    // Tiptap JSON veya HTML olarak saklanacak
  coverImage  String?
  published   Boolean   @default(false)
  publishedAt DateTime?
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Category {
  id          String     @id @default(cuid())
  title       String     // örn. "Frontend"
  slug        String     @unique
  description String?
  icon        String?    // ikon adı (lucide-react)
  order       Int        @default(0)
  roadmaps    Roadmap[]
}

model Roadmap {
  id          String   @id @default(cuid())
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  title       String   // örn. "Frontend Yol Haritası"
  slug        String   @unique
  description String?
  order       Int      @default(0)
  topics      Topic[]
}

model Topic {
  id         String   @id @default(cuid())
  roadmapId  String
  roadmap    Roadmap  @relation(fields: [roadmapId], references: [id])
  title      String   // örn. "İnternet Nasıl Çalışır?"
  slug       String
  content    String   // Tiptap JSON veya HTML
  videoUrl   String?  // YouTube linki
  order      Int      @default(0)

  @@unique([roadmapId, slug])
}

model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  content     String?
  coverImage  String?
  liveUrl     String?
  githubUrl   String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}
```

## 5. Klasör Yapısı (Next.js App Router)

```
/app
  /(public)
    /page.tsx                 → Ana sayfa
    /blog/page.tsx             → Blog listesi
    /blog/[slug]/page.tsx      → Blog detay
    /roadmap/page.tsx          → Kategori listesi
    /roadmap/[category]/page.tsx           → O kategorideki roadmap'ler
    /roadmap/[category]/[roadmap]/page.tsx → Roadmap'teki konu ağacı
    /roadmap/[category]/[roadmap]/[topic]/page.tsx → Konu detay (yazı + video)
    /projeler/page.tsx         → Proje listesi
    /projeler/[slug]/page.tsx  → Proje detay
    /giris, /kayit             → Auth sayfaları
  /admin
    /page.tsx                  → Dashboard
    /blog/...                  → Blog CRUD
    /roadmap/...                → Kategori/Roadmap/Konu CRUD
    /projeler/...               → Proje CRUD
  /api
    /auth/[...nextauth]/route.ts
    ... (gerekli diğer API route'ları)
/components
  /ui          → shadcn bileşenleri
  /editor      → Tiptap editör bileşeni
  /layout      → Header, Footer, ThemeToggle
  ...
/lib
  /prisma.ts
  /auth.ts
prisma/
  schema.prisma
```

## 6. Geliştirme Fazları

**Faz 1 — Temel (şimdi):**
- Next.js + Tailwind + shadcn/ui kurulumu, tasarım sistemi (renkler, tipografi, dark/light mode)
- Prisma şeması + Supabase bağlantısı
- Layout: Header (nav + tema switch), Footer
- Ana sayfa (hero + son blog yazıları + roadmap kategorileri önizleme)

**Faz 2 — İçerik Yönetimi:**
- Auth.js kurulumu (admin girişi)
- Admin panel: Blog CRUD (Tiptap editör ile)
- Blog public sayfaları (liste + detay)

**Faz 3 — Roadmap Sistemi:**
- Admin panel: Kategori / Roadmap / Konu CRUD
- Public roadmap sayfaları (kategori → roadmap → konu detay, video embed dahil)

**Faz 4 — Projeler + Cila:**
- Proje CRUD + public sayfalar
- SEO (metadata, sitemap.xml, OG image)
- Responsive kontrol, performans (Lighthouse) kontrolü

**Faz 5 (sonraki oturumlarda, şimdi değil):**
- Kullanıcı üyeliği (normal kullanıcı kaydı, ilerleme takibi)
- Reklam entegrasyonu
- Ücretli abonelik / reklamsız plan

Her fazın sonunda çalışan, deploy edilebilir bir durum bırak. Bir faz bitmeden
diğerine atlama; ama bir faz içinde mantıklı sırayla ilerle.

## 7. Kod Kuralları

- TypeScript strict mode açık kalsın, `any` kullanma.
- Server Component varsayılan; sadece interaktivite gerektiren yerlerde
  `"use client"` kullan (tema switch, form, editör gibi).
- Veritabanı sorgularını Server Component içinde veya Server Action olarak yaz,
  gereksiz API route yaratma (mutasyonlar için Server Actions tercih et).
- Slug'lar otomatik üretilsin (title'dan), ama admin panelde düzenlenebilir olsun.
- Türkçe karakterler slug'da düzgün handle edilsin (ör. "İnternet Nasıl Çalışır?" → "internet-nasil-calisir").
- Her CRUD işleminde form validasyonu yap (zod kullan).
- Commit'leri anlamlı, küçük parçalar halinde yap.

## 8. Ton ve İletişim

Ben (Yusuf) yazılım biliyorum ama backend/database konusunda zayıfım, bu yüzden
karmaşık kararları bana kısaca açıklayarak ilerle. Her fazın sonunda ne yaptığını
özetle ve bir sonraki adımı sor. Gereksiz yere büyük mimari kararlar alıp bana
danışmadan yön değiştirme.
