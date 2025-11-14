"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [error, setError] = useState<string | null>(null)

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", { method: "GET" })
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error(err)
        setError("Unable to load projects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Handle create new project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError(null)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create project")
      }

      const newProject = await response.json()
      setProjects((prev) => [newProject, ...prev])
      setFormData({ name: "", description: "" })
    } catch (error: any) {
      console.error("Failed to create project:", error)
      setError(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Projects</h1>
            <p className="text-muted-foreground">Create and manage your projects</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6">Create New Project</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create Project"}
              </button>
            </form>

            {error && <p className="text-red-500 mt-3">{error}</p>}
          </div>

          {/* Display projects */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">Your Projects</h2>

            {loading ? (
              <p className="text-muted-foreground">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-muted-foreground">No projects yet. Create one above!</p>
            ) : (
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="p-4 border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(project.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        View →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8">
            <Link href="/" className="text-primary hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
