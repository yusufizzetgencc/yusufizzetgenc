"use client"

import { useState } from "react"
import { PlayCircle, ExternalLink, CheckCircle2, Circle } from "lucide-react"
import { TopicModal } from "./topic-modal"

interface Topic {
  id: string
  title: string
  content: string
  videoUrl: string | null
  externalUrl: string | null
  order: number
}

interface RoadmapFlowProps {
  topics: Topic[]
}

export function RoadmapFlow({ topics }: RoadmapFlowProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic)
    setIsModalOpen(true)
  }

  if (topics.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 backdrop-blur-sm p-12 text-center text-muted-foreground">
        Bu yol haritası için henüz konu eklenmemiş.
      </div>
    )
  }

  return (
    <>
      <div className="relative py-12 flex flex-col items-center">
        {/* Merkezdeki dikey ana çizgi */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 bg-gradient-to-b from-purple-500/10 via-purple-500/20 to-transparent" />

        <div className="w-full max-w-4xl space-y-8 relative">
          {topics.map((topic, index) => {
            // Çift indeksler sağda, tek indeksler solda
            const isEven = index % 2 === 0

            return (
              <div 
                key={topic.id} 
                className={`relative flex items-center justify-between w-full group cursor-pointer ${
                  isEven ? "flex-row-reverse" : "flex-row"
                }`}
                onClick={() => handleTopicClick(topic)}
              >
                {/* Boş Taraf */}
                <div className="w-[calc(50%-2rem)] hidden md:block" />

                {/* Merkezdeki Nokta */}
                <div className="absolute left-1/2 -ml-4 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-purple-500 text-white shadow-[0_0_0_4px_rgba(168,85,247,0.1)] transition-transform group-hover:scale-125 z-10">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>

                {/* Kart (Kutu) */}
                <div className="w-full md:w-[calc(50%-2rem)] flex relative">
                  {/* Kutuyla merkez nokta arasındaki yatay çizgi */}
                  <div 
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-8 h-1 bg-purple-500/20 transition-colors group-hover:bg-purple-500/50 ${
                      isEven ? "right-full" : "left-full"
                    }`} 
                  />

                  <div className={`w-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 group-hover:border-purple-500/50 group-hover:bg-card group-hover:shadow-[0_8px_30px_rgb(168,85,247,0.12)] group-hover:-translate-y-1 relative overflow-hidden ${
                    isEven ? "md:mr-auto" : "md:ml-auto"
                  }`}>
                    {/* Kart İçi Gradient */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-500/0 via-transparent to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
                    
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-purple-500 transition-colors mb-3">
                        {topic.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {topic.videoUrl && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 border border-red-500/20">
                            <PlayCircle className="size-3" />
                            Video
                          </span>
                        )}
                        {topic.externalUrl && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-500 border border-indigo-500/20">
                            <ExternalLink className="size-3" />
                            Kaynak
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>

      <TopicModal 
        topic={selectedTopic} 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  )
}
