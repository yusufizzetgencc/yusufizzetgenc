import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TopicForm } from "../../../components/topic-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function NewTopicPage({
  params,
}: {
  params: { roadmapId: string }
}) {
  const { roadmapId } = await params
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: roadmapId },
  })

  if (!roadmap) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/roadmap/${roadmapId}`}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <div className="text-sm text-muted-foreground mb-1">{roadmap.title}</div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Konu</h1>
          <p className="mt-1 text-muted-foreground">
            Bu yol haritası için yeni bir eğitim konusu ekleyin.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <TopicForm roadmapId={roadmapId} />
      </div>
    </div>
  )
}
