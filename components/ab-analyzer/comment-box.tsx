"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommentBoxProps {
  className?: string
  style?: React.CSSProperties
  onSave: (comment: string) => void
  onClose: () => void
  type: "comment" | "highlight" | "screenshot"
}

export function CommentBox({ 
  className, 
  style,
  onSave, 
  onClose, 
  type 
}: CommentBoxProps) {
  const [comment, setComment] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)
  const saveTimeoutRef = React.useRef<NodeJS.Timeout>()

  // Sauvegarde automatique après 500ms d'inactivité
  const handleCommentChange = (value: string) => {
    setComment(value)
    setIsDirty(true)

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(value)
    }, 500)
  }

  const handleSave = async (valueToSave: string = comment) => {
    if (!valueToSave.trim()) return
    
    setIsSaving(true)
    try {
      await onSave(valueToSave)
      setIsDirty(false)
    } finally {
      setIsSaving(false)
    }
  }

  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Ajout d'une référence pour la box
  const boxRef = React.useRef<HTMLDivElement>(null)

  return (
    <Card 
      ref={boxRef}
      className={cn(
        "w-64 shadow-lg",
        "bg-background/95 backdrop-blur-sm",
        "border border-border/50",
        "transition-all duration-200",
        className
      )}
      style={style}
    >
      <div className="flex items-start p-2 gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          className={cn(
            "flex-1 text-sm resize-none min-h-[80px]",
            "bg-transparent border-none focus-visible:ring-0",
            "placeholder:text-muted-foreground/50"
          )}
        />
        
        <div className="flex flex-col gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleSave()}
            disabled={isSaving || !isDirty || !comment.trim()}
            className={cn(
              "h-6 w-6",
              isDirty && !isSaving && "text-primary",
              isSaving && "text-muted-foreground"
            )}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
} 