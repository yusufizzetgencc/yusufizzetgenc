import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Map, Folder, Users, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Sitenizin genel durumuna hoş geldiniz. Aşağıdan özet verilere ulaşabilirsiniz.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yazı</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postCount}</div>
            <p className="text-xs text-muted-foreground">Yayınlanmış ve taslaklar dahil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yol Haritası Konusu</CardTitle>
            <Map className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topicCount}</div>
            <p className="text-xs text-muted-foreground">Eğitim içerikleri</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projeler</CardTitle>
            <Folder className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground">Sergilenen projeler</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Üyeler</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Sistemdeki kayıtlı kullanıcı</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Son Yazılar */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Yazılar</CardTitle>
            <Link href="/admin/blog">
              <Button variant="ghost" size="sm" className="gap-1">
                Tümü <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {recentPosts.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">
                Henüz yazı eklenmemiş.
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium leading-none mb-1 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                      {post.published ? "Yayında" : "Taslak"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Son Projeler */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Projeler</CardTitle>
            <Link href="/admin/projeler">
              <Button variant="ghost" size="sm" className="gap-1">
                Tümü <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {recentProjects.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">
                Henüz proje eklenmemiş.
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <div key={project.id} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium leading-none mb-1 line-clamp-1">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.liveUrl ? "Canlı URL var" : "Sadece Github"}
                      </p>
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
