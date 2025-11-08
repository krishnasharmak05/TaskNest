import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { TaskStatus } from "@prisma/client"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const { id: projectId, taskId } = await params
  const { status, title, description, assigneeId } = await request.json()

  try {
    const updateData: any = {}
    if (status && Object.values(TaskStatus).includes(status)) {
      updateData.status = status
    }
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    return NextResponse.json(task)
  } catch (error) {
    console.error("Failed to update task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const { id: projectId, taskId } = await params

  try {
    await prisma.task.delete({
      where: { id: taskId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
