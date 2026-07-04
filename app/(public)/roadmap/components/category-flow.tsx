"use client"

import { useState } from "react"
import { PlayCircle, ExternalLink, MapIcon } from "lucide-react"
import { TopicModal } from "./topic-modal"

interface Topic {
  id: string
  title: string
  content: string
  videoUrl: string | null
  externalUrl: string | null
  order: number
}

interface RoadmapWithTopics {
  id: string
  title: string
  description: string | null
  slug: string
  topics: Topic[]
}

interface CategoryFlowProps {
  roadmaps: RoadmapWithTopics[]
}

export function CategoryFlow({ roadmaps }: CategoryFlowProps) {
  // Bütün konuları tek bir listede birleştir (İleri/Geri navigasyonu için)
  const allTopics = roadmaps.flatMap(r => r.topics)
  
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null)
  
  // Roadmap detayını göstermek için
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapWithTopics | null>(null)

  const handleTopicClick = (topicId: string) => {
    const index = allTopics.findIndex(t => t.id === topicId)
    if (index !== -1) {
      setSelectedTopicIndex(index)
      setSelectedRoadmap(null)
    }
  }

  const handleRoadmapClick = (roadmap: RoadmapWithTopics) => {
    setSelectedRoadmap(roadmap)
    setSelectedTopicIndex(null)
  }

  const handleClose = () => {
    setSelectedTopicIndex(null)
    setSelectedRoadmap(null)
  }

  const handleNext = () => {
    if (selectedTopicIndex !== null && selectedTopicIndex < allTopics.length - 1) {
      setSelectedTopicIndex(selectedTopicIndex + 1)
    }
  }

  const handlePrev = () => {
    if (selectedTopicIndex !== null && selectedTopicIndex > 0) {
      setSelectedTopicIndex(selectedTopicIndex - 1)
    }
  }

  if (roadmaps.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 backdrop-blur-sm p-12 text-center text-muted-foreground">
        Bu kategoriye ait henüz bir yol haritası eklenmemiş.
      </div>
    )
  }

  return (
    <>
      <div className="relative py-8 flex flex-col items-center w-full">
        {/* Merkezdeki dikey ana çizgi (Kategori boyunca) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 bg-gradient-to-b from-purple-500/10 via-indigo-500/20 to-transparent z-0" />

        <div className="w-full max-w-4xl relative z-10 flex flex-col gap-12">
          {roadmaps.map((roadmap, rIndex) => (
            <div key={roadmap.id} className="relative flex flex-col items-center w-full">
              
              {/* Roadmap Ana Başlığı (Büyük Kutu) */}
              <div 
                className="relative z-20 mb-8 flex flex-col items-center text-center cursor-pointer group"
                onClick={() => handleRoadmapClick(roadmap)}
              >
                <div className="bg-background border-4 border-background p-1 rounded-2xl shadow-xl transition-transform group-hover:scale-105">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 px-6 py-3 rounded-xl border border-white/10 shadow-inner">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      <MapIcon className="size-5 text-white/80" />
                      {roadmap.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Roadmap İçindeki Konular (Topics) */}
              <div className="w-full space-y-4 relative">
                {roadmap.topics.map((topic, tIndex) => {
                  // Çift indeksler sağda, tek indeksler solda
                  const isEven = tIndex % 2 === 0

                  return (
                    <div 
                      key={topic.id} 
                      className={`relative flex items-center justify-between w-full group cursor-pointer ${
                        isEven ? "flex-row-reverse" : "flex-row"
                      }`}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      {/* Boş Taraf */}
                      <div className="w-[calc(50%-1.5rem)] hidden md:block" />

                      {/* Merkezdeki Nokta */}
                      <div className="absolute left-1/2 -ml-3 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background bg-indigo-500 text-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)] transition-transform group-hover:scale-125 z-10">
                        <span className="text-[10px] font-bold">{tIndex + 1}</span>
                      </div>

                      {/* Kart (Kutu) */}
                      <div className="w-full md:w-[calc(50%-1.5rem)] flex relative">
                        {/* Kutuyla merkez nokta arasındaki yatay çizgi */}
                        <div 
                          className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-6 h-1 bg-indigo-500/20 transition-colors group-hover:bg-indigo-500/50 ${
                            isEven ? "right-full" : "left-full"
                          }`} 
                        />

                        <div className={`w-full rounded-xl border border-border/50 bg-card/90 backdrop-blur-sm p-3 transition-all duration-300 group-hover:border-indigo-500/50 group-hover:bg-card group-hover:shadow-md group-hover:-translate-y-0.5 relative overflow-hidden ${
                          isEven ? "md:mr-auto" : "md:ml-auto"
                        }`}>
                          {/* Kart İçi Gradient */}
                          <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
                          
                          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-indigo-500 transition-colors">
                              {topic.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                              {topic.videoUrl && (
                                <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500 border border-red-500/20">
                                  <PlayCircle className="size-2.5" />
                                  Video
                                </span>
                              )}
                              {topic.externalUrl && (
                                <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-500 border border-blue-500/20">
                                  <ExternalLink className="size-2.5" />
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
          ))}
        </div>
      </div>

      {/* Modal - Topic veya Roadmap için */}
      <TopicModal 
        topic={selectedTopicIndex !== null ? allTopics[selectedTopicIndex] : null}
        roadmap={selectedRoadmap}
        open={selectedTopicIndex !== null || selectedRoadmap !== null} 
        onOpenChange={(isOpen) => !isOpen && handleClose()} 
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={selectedTopicIndex !== null && selectedTopicIndex < allTopics.length - 1}
        hasPrev={selectedTopicIndex !== null && selectedTopicIndex > 0}
      />
    </>
  )
}
