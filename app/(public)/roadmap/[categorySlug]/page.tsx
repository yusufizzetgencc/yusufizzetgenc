import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Layers } from "lucide-react"
import { CategoryFlow } from "../components/category-flow"

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string }
}) {
  const { categorySlug } = await params
  
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      roadmaps: {
        orderBy: { order: "asc" },
        include: {
          topics: {
            orderBy: { order: "asc" }
          }
        }
      }
    }
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 page-enter">
      {/* Arka plan süslemeleri */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-[40%] right-[0%] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      {/* Geri Butonu */}
      <Link 
        href="/roadmap"
        className="group mb-12 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:bg-card hover:text-foreground hover:shadow-sm"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Tüm Kategorilere Dön
      </Link>
      
      {/* Sayfa Başlığı (Hero) */}
      <div className="mb-20 mx-auto max-w-4xl text-center flex flex-col items-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-500 backdrop-blur-sm">
          <Layers className="mr-2 size-4" />
          Kategori Detayı
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          {category.title}
        </h1>
        {category.description && (
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Dev Ağaç Yapısı (Flowchart) */}
      <CategoryFlow roadmaps={category.roadmaps} categorySlug={category.slug} />
    </div>
  )
}
