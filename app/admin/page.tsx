import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Map, Folder, Users, ArrowRight, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const statCards = [
  {
    label: "Toplam Yazı",
    icon: FileText,
    description: "Yayınlanmış ve taslaklar",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Yol Haritası Konusu",
    icon: Map,
    description: "Eğitim içerikleri",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Projeler",
    icon: Folder,
    description: "Sergilenen projeler",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Üyeler",
    icon: Users,
    description: "Kayıtlı kullanıcılar",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
]

export default async function AdminDashboardPage() {
  const [postCount, topicCount, projectCount, userCount, recentPosts, recentProjects] = await Promise.all([
    prisma.post.count(),
    prisma.topic.count(),
    prisma.project.count(),
    prisma.user.count(),
    prisma.post.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    })
  ])

  const counts = [postCount, topicCount, projectCount, userCount]

  return (
    <div className="space-y-8">
      {/* Hoşgeldin Alanı */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1.5 text-muted-foreground">
            Sitenizin genel durumuna hoş geldiniz.
          </p>
        </div>
        <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
          <TrendingUp className="size-3 text-emerald-500" />
          Tüm sistemler aktif
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`size-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{counts[index]}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Son Yazılar & Projeler */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Son Yazılar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Yazılar</CardTitle>
            <Link href="/admin/blog">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Tümü <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                Henüz yazı eklenmemiş.
              </div>
            ) : (
              <div className="space-y-3">
                {recentPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none mb-1 truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className={`ml-3 shrink-0 rounded-md px-2 py-1 text-xs font-medium ${
                      post.published 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {post.published ? "Yayında" : "Taslak"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Son Projeler */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Projeler</CardTitle>
            <Link href="/admin/projeler">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Tümü <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                Henüz proje eklenmemiş.
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map(project => (
                  <div key={project.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none mb-1 truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.description}
                      </p>
                    </div>
                    <div className="ml-3 shrink-0">
                      {project.liveUrl ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Canlı
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Github</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
