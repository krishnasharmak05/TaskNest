"use client"

import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { KanbanBoard } from "@/components/kanban-board"
import Link from "next/link"

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/" className="text-primary hover:underline text-sm mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-4xl font-bold text-foreground">Project Board</h1>
            </div>
          </div>
          <KanbanBoard projectId={projectId} />
        </div>
      </main>
    </>
  )
}
