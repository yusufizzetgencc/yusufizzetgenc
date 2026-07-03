import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProjectForm } from "../components/project-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projeler"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projeyi Düzenle</h1>
          <p className="mt-1 text-muted-foreground">
            Sergilenen projenizin bilgilerini ve içeriğini güncelleyin.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
