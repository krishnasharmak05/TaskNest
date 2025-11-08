"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Navbar() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" })
      if (response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          TaskNest
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/projects" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Projects
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              About
            </Link>
          </div>

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </nav>
  )
}
