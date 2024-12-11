"use client"

import { ABAnalyzer } from "@/components/ab-analyzer"
import { StatisticsPanel } from "@/components/ab-analyzer/statistics-panel"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FileData {
  name: string
  content: any
}

interface Filter {
  device_category: string[]
  item_category2: string[]
}

interface CommentPosition {
  x: number
  y: number
}

export default function AnalyzerPage() {
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [processStep, setProcessStep] = useState<'initial' | 'processing' | 'analyzed'>('initial')
  const [testData, setTestData] = useState<any>(null)
  const [currency, setCurrency] = useState('EUR')
  const [filters, setFilters] = useState<Filter>({
    device_category: [],
    item_category2: []
  })
  const [overallData, setOverallData] = useState<FileData | null>(null)
  const [transactionData, setTransactionData] = useState<FileData | null>(null)
  const [results, setResults] = useState<any>(null)
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false)
  const [selectedTool, setSelectedTool] = useState<"comment" | "highlight" | "screenshot" | null>(null)
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 })
  const [isAnalysisMode, setIsAnalysisMode] = useState(false)

  const handleAnalysisStart = async (data: any) => {
    setShowAnalysis(true)
    setTestData(data)
    // Ici on pourrait aussi déclencher une nouvelle analyse avec les filtres actuels
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    // Re-analyser les données avec la nouvelle devise si nécessaire
  }

  const handleFilterChange = (filterType: keyof Filter, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [filterType]: newValues
      }
    })
    // Re-analyser les données avec les nouveaux filtres
  }

  const handleToolSelect = (tool: "comment" | "highlight" | "screenshot", position: { x: number, y: number }) => {
    setSelectedTool(tool)
    setCommentPosition(position)
  }

  const handleSaveComment = (comment: string) => {
    // Logique de sauvegarde
    console.log('Saving comment:', {
      type: selectedTool,
      content: comment,
      position: commentPosition
    })
    setSelectedTool(null)
  }

  return (
    <div className="flex h-full max-w-[1600px] mx-auto p-6 gap-6 relative">
      <div className={cn(
        "transition-all duration-300 min-w-[400px] h-full",
        isSummaryCollapsed ? "w-[200px]" :
        processStep === 'analyzed' && !showAnalysis 
          ? "w-full" 
          : showAnalysis 
            ? "w-[30%]" 
            : "w-[400px]"
      )}>
        <ABAnalyzer 
          onAnalysisStart={(data) => {
            setShowAnalysis(true)
            setTestData(data)
          }}
          onProcessStepChange={setProcessStep}
          showAnalysis={showAnalysis}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onCollapse={setIsSummaryCollapsed}
        />
      </div>
      
      {showAnalysis && (
        <div className={cn(
          "flex-1 transition-all duration-300 transform",
          "animate-in slide-in-from-right"
        )}>
          <StatisticsPanel 
            testData={testData}
            currency={currency}
            filters={filters}
            results={results}
            isCollapsed={isSummaryCollapsed}
            onToolSelect={handleToolSelect}
          />
        </div>
      )}
    </div>
  )
} 