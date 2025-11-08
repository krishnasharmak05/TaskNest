"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import NextAuth from "next-auth"

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
    () => {
        const data: Project = {
          id: "1",
          name: "Sample Project",
          description: "This is a sample project description.",
          createdAt: formatDate(new Date()),
          ownerId: session.user.id
        }
        setProjects([data])
        setLoading(false)
      }
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
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">{project.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{project.description || "No description"}</p>
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
