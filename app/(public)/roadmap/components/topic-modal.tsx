"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlayCircle, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Topic {
  id: string
  title: string
  content: string
  videoUrl: string | null
  externalUrl: string | null
}

interface Roadmap {
  id: string
  title: string
  description: string | null
}

interface TopicModalProps {
  topic?: Topic | null
  roadmap?: Roadmap | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNext?: () => void
  onPrev?: () => void
  hasNext?: boolean
  hasPrev?: boolean
}

export function TopicModal({ 
  topic, 
  roadmap,
  open, 
  onOpenChange,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: TopicModalProps) {
  const currentItem = topic || roadmap
  if (!currentItem) return null

  const isRoadmap = !!roadmap
  
  // Roadmap açıklaması düz metin olabilir, Markdown'a çevirmek ya da direk göstermek gerek.
  // Bizim veritabanında description genelde text.
  const roadmapContent = roadmap?.description 
    ? `<p>${roadmap.description.replace(/\n/g, '<br/>')}</p>` 
    : '<p>Bu bölüm için henüz bir açıklama girilmemiş.</p>'

  const displayContent = isRoadmap ? roadmapContent : (topic?.content || '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] p-0 flex flex-col gap-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50">
        
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border/50 shrink-0 bg-background/50 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl md:text-2xl font-bold leading-tight flex-1">
            {currentItem.title}
          </DialogTitle>
        </DialogHeader>

        {/* İçerik */}
        <div className="p-6 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none text-muted-foreground flex-1">
          {displayContent ? (
            <div dangerouslySetInnerHTML={{ __html: displayContent }} />
          ) : (
            <p>İçerik bulunamadı.</p>
          )}
        </div>

        {/* Footer (Linkler ve İleri/Geri) */}
        <div className="p-4 sm:p-5 border-t border-border/50 bg-background/50 shrink-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* İleri / Geri Navigasyon */}
          {!isRoadmap && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start order-2 sm:order-1">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
              >
                <ArrowLeft className="size-4" />
                Önceki
              </button>
              
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
              >
                Sonraki
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {/* Derse Git / Kaynağa Git */}
          {!isRoadmap && topic && (topic.videoUrl || topic.externalUrl) && (
            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
              {topic.videoUrl && (
                <Link 
                  href={topic.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400 py-2 px-4 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                >
                  <PlayCircle className="size-4" />
                  Dersi İzle
                </Link>
              )}
              
              {topic.externalUrl && (
                <Link 
                  href={topic.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400 py-2 px-4 rounded-lg text-sm font-medium transition-colors border border-indigo-500/20"
                >
                  <ExternalLink className="size-4" />
                  Derse Git
                </Link>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
