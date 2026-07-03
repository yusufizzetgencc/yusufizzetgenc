import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProjectForm } from "../components/project-form"

export default function NewProjectPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Yeni Proje</h1>
          <p className="mt-1 text-muted-foreground">
            Portfolyonuzda sergilenecek yeni bir proje ekleyin.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <ProjectForm />
      </div>
    </div>
  )
}
