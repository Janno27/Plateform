// statistics-panel.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { RawDataTable } from "./raw-data-table"
import { OverviewTable } from "./overview-table"
import { RevenueAnalysis } from "./revenue-analysis"
import { ClipboardEdit } from "lucide-react"
import { AnalysisPanel } from "./analysis-panel"
import { Button } from "@/components/ui/button"
import { AnalysisToolsMenu } from "./analysis-tools-menu"
import { CommentBox } from "./comment-box"

interface StatisticsPanelProps {
  testData: {
    analysisData: any;
    currency: string;
  }
  currency: string;
  filters: {
    device_category: string[]
    item_category2: string[]
  }
  results: any
  isCollapsed: boolean
  onToolSelect: (tool: "comment" | "highlight" | "screenshot", position: { x: number; y: number }) => void
}

interface AnalysisNote {
  id: string
  type: "comment" | "highlight" | "screenshot"
  content: string
  position: { x: number; y: number }
  timestamp: number
}

export function StatisticsPanel({
  testData,
  currency,
  filters,
  results,
  isCollapsed,
  onToolSelect
}: StatisticsPanelProps) {
  const [overviewData, setOverviewData] = React.useState<any>(null)
  const [isLoadingOverview, setIsLoadingOverview] = React.useState(false)
  const [analysisTable, setAnalysisTable] = React.useState<any>(null)
  const [isAnalysisMode, setIsAnalysisMode] = React.useState(false)
  const [selectedTool, setSelectedTool] = React.useState<"comment" | "highlight" | "screenshot" | null>(null)
  const [commentPosition, setCommentPosition] = React.useState({ x: 0, y: 0 })
  const [notes, setNotes] = React.useState<AnalysisNote[]>([])
  const [activeTab, setActiveTab] = React.useState("overview")

  const fetchOverviewData = React.useCallback(async () => {
    try {
      setIsLoadingOverview(true)
      const dataToSend = {
        overall: testData?.analysisData?.raw_data?.overall || [],
        transaction: testData?.analysisData?.raw_data?.transaction || []
      }
      
      const response = await fetch('http://localhost:8000/calculate-overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch overview data')
      }
      
      const result = await response.json()
      if (!result.success) {
        throw new Error('Invalid response format')
      }

      setOverviewData(result)
    } catch (error) {
      // Silent error
    } finally {
      setIsLoadingOverview(false)
    }
  }, [testData])

  const createAnalysisTable = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/create-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData?.analysisData),
      })

      if (!response.ok) {
        throw new Error('Failed to create analysis table')
      }

      const result = await response.json()
      if (result.success) {
        setAnalysisTable(result.data)
        
        // Affichage de la table virtuelle dans la console du navigateur
        console.group('=== VIRTUAL ANALYSIS TABLE ===')
        console.log('Structure:')
        console.log('Total rows:', result.data.length)
        console.log('Columns:', Object.keys(result.data[0]))
        console.log('\nFirst 10 rows:')
        console.table(result.data.slice(0, 10))
        console.groupEnd()
      }
    } catch (error) {
      // Silent error
    }
  }, [testData])

  React.useEffect(() => {
    if (testData?.analysisData?.raw_data?.overall) {
      fetchOverviewData()
    }
  }, [testData, fetchOverviewData])

  React.useEffect(() => {
    if (testData?.analysisData) {
      createAnalysisTable()
    }
  }, [testData, createAnalysisTable])

  React.useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("analysis-notes")
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes)
        setNotes(parsedNotes)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error)
      // Réinitialiser les notes si le JSON est invalide
      localStorage.setItem("analysis-notes", JSON.stringify([]))
    }
  }, [])

  const handleToolSelect = (tool: "comment" | "highlight" | "screenshot", position: { x: number, y: number }) => {
    setSelectedTool(tool)
    setCommentPosition(position)
  }

  const handleSaveComment = (comment: string) => {
    const newNote: AnalysisNote = {
      id: Date.now().toString(),
      type: selectedTool!,
      content: comment,
      position: commentPosition,
      timestamp: Date.now()
    }
    
    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    localStorage.setItem("analysis-notes", JSON.stringify(updatedNotes))
    setSelectedTool(null)
  }

  return (
    <div className="h-full relative">
      <AnalysisToolsMenu onSelectTool={handleToolSelect} isAnalysisMode={isAnalysisMode}>
        <Card 
          className={cn(
            "h-full",
            "transition-all duration-300",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
            isCollapsed ? "w-[calc(100%-200px)]" : "w-full",
            isAnalysisMode && [
              "w-full relative",
              "ring-1 ring-primary",
            ]
          )}
        >
          {isAnalysisMode && (
            <div className="absolute -top-5 right-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-t-lg text-xs font-medium shadow-sm">
              Analysis Mode
            </div>
          )}

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="h-full flex flex-col"
          >
            <div className={cn(
              "flex items-center justify-between border-b px-6 py-4 shrink-0",
              isAnalysisMode && "bg-primary/5"
            )}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="funnel">Funnel</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="raw">Raw</TabsTrigger>
              </TabsList>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAnalysisMode(!isAnalysisMode)}
                className={cn(
                  "ml-auto relative",
                  isAnalysisMode && [
                    "bg-primary/10 hover:bg-primary/20",
                    "after:content-['Analysis_Mode']",
                    "after:absolute after:right-full after:-translate-x-2",
                    "after:text-xs after:font-medium after:text-primary/70",
                    "after:px-2 after:py-1 after:rounded-md",
                    "after:whitespace-nowrap",
                  ]
                )}
              >
                <ClipboardEdit className={cn(
                  "h-4 w-4",
                  isAnalysisMode && "text-primary"
                )} />
                {isAnalysisMode && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </Button>
            </div>

            <div className="flex-1 relative overflow-auto content-area">
              <TabsContent value="overview" className="p-6 absolute inset-0">
                <div className="h-full overflow-auto relative">
                  <OverviewTable 
                    data={overviewData} 
                    isLoading={isLoadingOverview}
                  />
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="p-6 absolute inset-0">
                Engagement content
              </TabsContent>

              <TabsContent value="funnel" className="p-6 absolute inset-0">
                Funnel content
              </TabsContent>

              <TabsContent value="revenue" className="p-6 absolute inset-0">
                <div className="h-full overflow-auto">
                  <RevenueAnalysis 
                    data={testData} 
                    isLoading={isLoadingOverview}
                  />
                </div>
              </TabsContent>

              <TabsContent 
                value="raw" 
                className="absolute inset-0 overflow-hidden"
              >
                <RawDataTable 
                  data={testData} 
                  currency={testData.currency || currency}
                />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </AnalysisToolsMenu>

      {selectedTool && isAnalysisMode && (
        <div className="absolute inset-0 pointer-events-none">
          <CommentBox
            position={commentPosition}
            type={selectedTool}
            onSave={handleSaveComment}
            onClose={() => setSelectedTool(null)}
          />
        </div>
      )}
    </div>
  )
}