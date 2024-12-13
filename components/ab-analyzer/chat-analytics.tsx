"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Bot, Send, Loader2, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatAnalyticsProps {
  className?: string
  onClose: () => void
  testData?: any
}

export function ChatAnalytics({ className, onClose, testData }: ChatAnalyticsProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{
      id: '0',
      content: "Bonjour ! Je suis votre assistant d'analyse A/B. Je peux vous aider à interpréter vos résultats de test et vous fournir des insights basés sur vos données. Que souhaitez-vous savoir ?",
      role: 'assistant',
      timestamp: new Date()
    }])
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Je vois que vous avez une variation de test avec un uplift de +0.82% sur le revenu total. Cependant, la confiance statistique est de 75.53%, ce qui est en dessous du seuil standard de 95%. Je vous conseille de continuer le test pour obtenir plus de données avant de prendre une décision définitive.",
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className={cn(
      "flex flex-col h-full",
      "bg-background shadow-none border-none",
      className
    )}>
      <div className="flex-none px-6 py-2 bg-background/50">
        <h3 className="text-sm font-medium text-muted-foreground">Assistant Analytique</h3>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div className="sticky top-0 left-0 right-0 h-24 bg-gradient-to-b from-background via-background/80 to-transparent z-10 pointer-events-none" />
        
        <div className="absolute inset-0">
          <div 
            ref={scrollRef}
            className="h-full overflow-auto px-6"
          >
            <div className="flex flex-col-reverse">
              <div className="space-y-6 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === 'user' ? "justify-end" : "justify-start",
                      "animate-in fade-in-0 slide-in-from-bottom-2"
                    )}
                  >
                    <div className={cn(
                      "flex items-start gap-3 max-w-[90%]",
                      message.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                      <Avatar className={cn(
                        "h-8 w-8 shrink-0",
                        message.role === 'assistant' ? "bg-muted/50" : "bg-primary"
                      )}>
                        {message.role === 'assistant' && <Bot className="h-5 w-5 text-foreground/80" />}
                      </Avatar>
                      <div className={cn(
                        "flex-1 text-sm leading-relaxed whitespace-pre-wrap",
                        "rounded-lg px-4 py-3",
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-foreground/90'
                      )}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Assistant est en train d'écrire...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-none p-4 bg-background">
        <form 
          onSubmit={handleSubmit} 
          className="relative max-w-[720px] mx-auto"
        >
          <div className="relative flex items-end gap-2 p-[1px] bg-background rounded-lg border shadow-sm">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez une question sur vos données..."
              className={cn(
                "flex-1 min-h-[52px] max-h-[400px]",
                "bg-transparent",
                "px-4 py-3 pr-24",
                "resize-none overflow-auto",
                "border-0 focus-visible:ring-0",
                "placeholder:text-muted-foreground/60",
                "text-base leading-relaxed"
              )}
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted"
                onClick={() => {/* TODO: Implémenter la sélection de contenu */}}
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button 
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className={cn(
                  "h-8 w-8 rounded-full",
                  "bg-primary hover:bg-primary/90"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  )
}