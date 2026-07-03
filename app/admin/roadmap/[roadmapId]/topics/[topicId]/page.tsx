import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TopicForm } from "../../../components/topic-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditTopicPage({
  params,
}: {
  params: { roadmapId: string; topicId: string }
}) {
  const { roadmapId, topicId } = await params
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: roadmapId },
  })
  
  if (!roadmap) {
    notFound()
  }

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
  })

  if (!topic || topic.roadmapId !== roadmapId) {
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
          <h1 className="text-3xl font-bold tracking-tight">Konuyu Düzenle</h1>
          <p className="mt-1 text-muted-foreground">
            Eğitim konusunun içerik ve bilgilerini güncelleyin.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <TopicForm roadmapId={roadmapId} topic={topic} />
      </div>
    </div>
  )
}
