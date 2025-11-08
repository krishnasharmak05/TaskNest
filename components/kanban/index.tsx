"use client"

import type React from "react"

export function Kanban({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-6 overflow-x-auto pb-4">{children}</div>
}

interface KanbanColumnProps {
  title: string
  count: number
  children: React.ReactNode
}

export function KanbanColumn({ title, count, children }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-secondary rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">{count}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

interface KanbanCardProps {
  title: string
  description?: string
  onMove: () => void
  onDelete: () => void
  moveButtonLabel: string
}

export function KanbanCard({ title, description, onMove, onDelete, moveButtonLabel }: KanbanCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-card-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
      <div className="flex gap-2">
        <button
          onClick={onMove}
          className="flex-1 text-xs font-medium px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          {moveButtonLabel}
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-xs font-medium bg-destructive text-white rounded hover:opacity-90 transition-opacity"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
