import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { VideoForm } from "../components/video-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditVideoPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const video = await prisma.video.findUnique({
    where: { id },
  })
  
  const categories = await prisma.videoCategory.findMany({
    orderBy: { order: "asc" },
  })

  if (!video) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/videolar"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Videoyu Düzenle</h1>
          <p className="mt-1 text-muted-foreground">
            Eklediğiniz videonun bilgilerini güncelleyin.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <VideoForm video={video} categories={categories} />
      </div>
    </div>
  )
}
