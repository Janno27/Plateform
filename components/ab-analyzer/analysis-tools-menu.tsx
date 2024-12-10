"use client"

import * as React from "react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Highlighter, MessageSquare, Camera } from "lucide-react"
import { CommentBox } from "./comment-box"

interface AnalysisToolsMenuProps {
  children: React.ReactNode
  onSelectTool: (tool: "comment" | "highlight" | "screenshot", position: { x: number; y: number }) => void
  isAnalysisMode: boolean
}

export function AnalysisToolsMenu({ children, onSelectTool, isAnalysisMode }: AnalysisToolsMenuProps) {
  if (!isAnalysisMode) {
    return <>{children}</>
  }

  const [selectedTool, setSelectedTool] = React.useState<"comment" | "highlight" | "screenshot" | null>(null)

  const handleSaveComment = (comment: string) => {
    if (selectedTool) {
      onSelectTool(selectedTool, { x: 0, y: 0 })
    }
    setSelectedTool(null)
  }

  const handleSelect = (tool: "comment" | "highlight" | "screenshot", e: MouseEvent) => {
    onSelectTool(tool, {
      x: e.clientX,
      y: e.clientY
    })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <div className="relative">
        <ContextMenuContent className="w-48">
          <ContextMenuItem onSelect={(e) => handleSelect("comment", e as unknown as MouseEvent)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Comment
          </ContextMenuItem>
          <ContextMenuItem onSelect={(e) => handleSelect("highlight", e as unknown as MouseEvent)}>
            <Highlighter className="mr-2 h-4 w-4" />
            Highlight + Comment
          </ContextMenuItem>
          <ContextMenuItem onSelect={(e) => handleSelect("screenshot", e as unknown as MouseEvent)}>
            <Camera className="mr-2 h-4 w-4" />
            Screenshot + Comment
          </ContextMenuItem>
        </ContextMenuContent>
        {selectedTool && (
          <CommentBox
            className="absolute left-full top-0 ml-2"
            onSave={handleSaveComment}
            onClose={() => setSelectedTool(null)}
            type={selectedTool}
          />
        )}
      </div>
    </ContextMenu>
  )
} 