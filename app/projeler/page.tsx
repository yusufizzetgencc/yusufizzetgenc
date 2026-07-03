import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"

export const metadata: Metadata = {
  title: "Projelerim",
  description: "Geliştirdiğim açık kaynaklı ve kişisel projeler.",
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Benim <span className="text-primary">Projelerim</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Bugüne kadar geliştirdiğim açık kaynaklı araçlar, web uygulamaları ve kişisel projelerimin bir listesi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">Henüz proje eklenmemiş.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-6 transition-all hover:bg-card hover:shadow-xl"
            >
              <div className="flex-1 space-y-4">
                {project.coverImage && (
                  <div className="relative -mx-6 -mt-6 mb-6 aspect-[2/1] overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4 border-t border-border/50 pt-6">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="size-4" />
                    Canlı Gösterim
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="size-4" />
                    Kaynak Kod
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
