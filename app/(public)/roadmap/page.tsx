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
  Cpu
} from "lucide-react"

export const metadata = {
  title: "Yol Haritaları | Yusuf İzzet Genç",
  description: "Yazılım ve teknoloji alanlarında kendinizi geliştirmek için adım adım rehberler.",
}

// Veritabanındaki "icon" string değerini gerçek Lucide ikonuna çeviren yardımcı fonksiyon
const CategoryIcon = ({ iconName }: { iconName: string | null }) => {
  const icons: Record<string, React.ElementType> = {
    Terminal, Code2, Layout, Server, Database, Smartphone, Cpu, Map
  }
  
  // Eşleşen ikon varsa onu, yoksa varsayılan olarak "Map" ikonunu kullan
  const Icon = iconName && icons[iconName] ? icons[iconName] : Map
  
  return <Icon className="size-6 text-indigo" />
}

export default async function RoadmapPage() {
  // Kategorileri ve altındaki yol haritalarını sırasına göre çekiyoruz
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
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-24 page-enter">
      {/* Sayfa Başlığı */}
      <div className="mb-16 max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Yol Haritaları
        </h1>
        <p className="text-lg text-muted-foreground">
          Sıfırdan ileri seviyeye kadar yapılandırılmış öğrenme rehberleri. 
          Kendinizi geliştirmek istediğiniz alanı seçin ve çalışmaya başlayın.
        </p>
      </div>

      {/* Kategoriler Grid */}
      {categories.length === 0 ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Map className="mx-auto mb-4 size-10 text-muted-foreground/30" />
          <h3 className="text-lg font-medium">Henüz içerik yok</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Yol haritaları çok yakında eklenecektir.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/roadmap/${category.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-indigo/40 hover:shadow-[0_4px_24px_-6px_rgba(99,102,241,0.12)]"
            >
              <div>
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-indigo/8 p-3 transition-colors group-hover:bg-indigo/15">
                  <CategoryIcon iconName={category.icon} />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {category.title}
                </h2>
                {category.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="mt-8">
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  İçerikler ({category.roadmaps.length})
                </div>
                <ul className="space-y-2">
                  {category.roadmaps.slice(0, 3).map((roadmap) => (
                    <li 
                      key={roadmap.id}
                      className="flex items-center text-sm text-foreground/80"
                    >
                      <div className="mr-2.5 size-1.5 rounded-full bg-indigo/40" />
                      {roadmap.title}
                    </li>
                  ))}
                  {category.roadmaps.length > 3 && (
                    <li className="text-sm italic text-muted-foreground">
                      + {category.roadmaps.length - 3} yol haritası daha...
                    </li>
                  )}
                  {category.roadmaps.length === 0 && (
                    <li className="text-sm italic text-muted-foreground">
                      İçerik hazırlanıyor...
                    </li>
                  )}
                </ul>

                <div className="mt-6 flex items-center text-sm font-medium text-indigo opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                  Kategoriyi İncele <ChevronRight className="ml-1 size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}