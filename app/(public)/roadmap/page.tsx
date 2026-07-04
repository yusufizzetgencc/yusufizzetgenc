import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { 
  ChevronRight, 
  Map, 
  Terminal, 
  Code2, 
  Layout, 
  Server, 
  Database,
  Smartphone,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react"

export const metadata = {
  title: "Yol Haritaları | Yusuf İzzet Genç",
  description: "Yazılım ve teknoloji alanlarında kendinizi geliştirmek için adım adım rehberler.",
}

const CategoryIcon = ({ iconName, className }: { iconName: string | null, className?: string }) => {
  const icons: Record<string, React.ElementType> = {
    Terminal, Code2, Layout, Server, Database, Smartphone, Cpu, Map, Layers
  }
  
  const Icon = iconName && icons[iconName] ? icons[iconName] : Layers
  
  return <Icon className={className || "size-6"} />
}

export default async function RoadmapPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      roadmaps: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, slug: true },
      },
    },
  })

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 page-enter">
      {/* Arka plan süslemeleri */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      {/* Sayfa Başlığı */}
      <div className="mb-16 max-w-3xl text-center md:text-left">
        <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-500 backdrop-blur-sm">
          <Map className="mr-2 size-4" />
          Kariyer Yolculuğu
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          Yol Haritaları
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Sıfırdan ileri seviyeye kadar detaylı ve yapılandırılmış öğrenme rehberleri. 
          Kendinizi geliştirmek istediğiniz alanı seçin ve kariyerinize yön verin.
        </p>
      </div>

      {/* Kategoriler Grid */}
      {categories.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 backdrop-blur-sm p-12 text-center">
          <Map className="mx-auto mb-4 size-12 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold">Henüz içerik yok</h3>
          <p className="mt-2 text-muted-foreground">
            Yol haritaları çok yakında eklenecektir.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/roadmap/${category.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 transition-all duration-300 hover:border-indigo-500/50 hover:bg-card hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] hover:-translate-y-1"
            >
              {/* Üst Kısım: İkon ve Başlık */}
              <div className="relative z-10">
                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-500 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:from-indigo-500/30 group-hover:to-purple-500/30">
                  <CategoryIcon iconName={category.icon} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-indigo-500 transition-colors">
                  {category.title}
                </h2>
                {category.description && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Alt Kısım: İçerikler ve Buton */}
              <div className="relative z-10 mt-8 pt-6 border-t border-border/50 flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground/80">
                    İçerikler
                  </span>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-500">
                    {category.roadmaps.length} Roadmap
                  </span>
                </div>
                
                <ul className="space-y-3">
                  {category.roadmaps.slice(0, 3).map((roadmap) => (
                    <li 
                      key={roadmap.id}
                      className="flex items-center text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground/80"
                    >
                      <div className="mr-3 flex size-5 items-center justify-center rounded-full bg-muted/80">
                        <ChevronRight className="size-3 text-muted-foreground/70" />
                      </div>
                      <span className="truncate">{roadmap.title}</span>
                    </li>
                  ))}
                  {category.roadmaps.length > 3 && (
                    <li className="text-sm font-medium text-indigo-500/70 italic ml-8">
                      + {category.roadmaps.length - 3} yol haritası daha...
                    </li>
                  )}
                  {category.roadmaps.length === 0 && (
                    <li className="text-sm font-medium text-muted-foreground/60 italic">
                      İçerik hazırlanıyor...
                    </li>
                  )}
                </ul>

                <div className="mt-4 flex w-full items-center justify-center rounded-xl bg-indigo-500/10 py-3 text-sm font-semibold text-indigo-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-indigo-500/20">
                  Kategoriyi İncele
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              
              {/* Kart İçi Gradient Efekti */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}