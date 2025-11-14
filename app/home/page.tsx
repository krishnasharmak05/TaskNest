"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import NextAuth from "next-auth"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"


interface Project {
  id: string
  name: string
  description: string | null
  createdAt: string,
  ownerId: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleDelete = async (projectId: string) => {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
  })

  if (res.ok) {
    // Remove project from UI
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
  } else {
    console.error("Failed to delete project")
  }
}


  const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to TaskNest</p>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              + Add New Project
            </Link>
          </div>


          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading projects...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Link href="/projects" className="text-primary hover:underline">
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map((project) => (
    <div
      key={project.id}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      {/* Title + Delete Row */}
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-xl font-semibold text-card-foreground">
          {project.name}
        </h2>

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm"   className="cursor-pointer">
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the project and all its tasks.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(project.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4">
        {project.description || "No description"}
      </p>

      {/* Footer: Date + View */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>

        <Link
          href={`/projects/${project.id}`}
          className="text-primary hover:underline text-sm font-medium"
        >
          View →
        </Link>
      </div>
    </div>
  ))}
</div>

          )}
        </div>
      </main>
    </>
  )
}
