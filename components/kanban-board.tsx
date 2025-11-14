"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Kanban, KanbanColumn, KanbanCard } from "@/components/kanban"

interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  projectId: string
}

interface KanbanBoardProps {
  projectId: string
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskColumn, setNewTaskColumn] = useState<"todo" | "in_progress" | "done">("todo")

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`)
      if (response.ok) {
        const data = await response.json()
        console.log("Tasks data:", data);
        setTasks(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    console.log("Adding task:", newTaskTitle, "to column:", newTaskColumn);
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          status: newTaskColumn,
        }),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks([...tasks, newTask])
        setNewTaskTitle("")
      }
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

  const handleMoveTask = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus as any } : task)))
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId))
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

  const todoTasks = tasks.filter((t) => t.status.toLowerCase() === "todo")
  const inProgressTasks = tasks.filter((t) => t.status.toLowerCase() === "doing")
  const doneTasks = tasks.filter((t) => t.status.toLowerCase() === "done")

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={newTaskColumn}
          onChange={(e) => {
            setNewTaskColumn(e.target.value as any)
          }
          }
          className="px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="TODO">To Do</option>
          <option value="DOING">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Add
        </button>
      </form>

      <Kanban>
        <KanbanColumn title="To Do" count={todoTasks.length}>
          {todoTasks.map((task) => (
            <KanbanCard
              key={task.id}
              title={task.title}
              description={task.description}
              onMove={() => handleMoveTask(task.id, "DOING")}
              onDelete={() => handleDeleteTask(task.id)}
              moveButtonLabel="Start"
            />
          ))}
        </KanbanColumn>

        <KanbanColumn title="In Progress" count={inProgressTasks.length}>
          {inProgressTasks.map((task) => (
            <KanbanCard
              key={task.id}
              title={task.title}
              description={task.description}
              onMove={() => handleMoveTask(task.id, "DONE")}
              onDelete={() => handleDeleteTask(task.id)}
              moveButtonLabel="Complete"
            />
          ))}
        </KanbanColumn>

        <KanbanColumn title="Done" count={doneTasks.length}>
          {doneTasks.map((task) => (
            <KanbanCard
              key={task.id}
              title={task.title}
              description={task.description}
              onMove={() => handleMoveTask(task.id, "TODO")}
              onDelete={() => handleDeleteTask(task.id)}
              moveButtonLabel="Reopen"
            />
          ))}
        </KanbanColumn>
      </Kanban>
    </div>
  )
}
