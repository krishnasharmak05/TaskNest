import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">About</h1>
            <p className="text-muted-foreground">Learn more about our project management platform</p>
          </div>

          <div className="space-y-6 prose prose-invert max-w-none">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">About TaskNest</h2>
              <p className="text-foreground mb-4">
                TaskNest is designed to help teams organize, track, and manage their
                projects efficiently. With an intuitive interface and powerful features, you can streamline your
                workflow and boost productivity.
              </p>

              <h3 className="text-xl font-semibold text-card-foreground mt-6 mb-3">Features</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Create and manage multiple projects</li>
                <li>Organize tasks into customizable boards</li>
                <li>Track project progress and timelines</li>
                <li>Intuitive interface</li>
              </ul>

              <h3 className="text-xl font-semibold text-card-foreground mt-6 mb-3">Get Started</h3>
              <p className="text-foreground mb-4">
                Head to the{" "}
                <Link href="/projects" className="text-primary hover:underline">
                  Projects page
                </Link>{" "}
                to create your first project or visit the{" "}
                <Link href="/" className="text-primary hover:underline">
                  Dashboard
                </Link>{" "}
                to view your existing projects.
              </p>
            </div>
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
