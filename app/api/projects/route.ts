import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

// 🟢 GET: Fetch all projects for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in /api/projects GET:", session)
    if (!session?.user?.id) {
      console.log("Unauthorized access attempt to /api/projects");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { ownerId: session.user.id },
      include: {
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("GET /api/projects error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 🟢 POST: Create a new project
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await req.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: session.user.id, // ✅ use session.user.id directly
      },
      include: {
        owner: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("POST /api/projects error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
