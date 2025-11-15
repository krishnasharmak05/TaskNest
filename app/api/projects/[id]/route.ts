import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: projectId } = await params

    // Ensure the project belongs to the current user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete project (tasks will delete automatically if FK cascade is enabled)
    await prisma.project.delete({
      where: { id: projectId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
