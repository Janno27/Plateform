"use client"

import { TestSummary } from "./test-summary"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ABAnalyzerProps {
  onAnalysisStart: (data: any) => void
  onProcessStepChange: (step: 'initial' | 'processing' | 'analyzed') => void
  showAnalysis: boolean
  currency: string
  onCurrencyChange: (currency: string) => void
  filters: {
    device_category: string[]
    item_category2: string[]
  }
  onFilterChange: (filterType: string, value: string) => void
  onCollapse: (collapsed: boolean) => void
}

export function ABAnalyzer({ 
  onAnalysisStart,
  onProcessStepChange,
  showAnalysis,
  currency,
  onCurrencyChange,
  filters,
  onFilterChange,
  onCollapse
}: ABAnalyzerProps) {
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-tight">A/B Test Analyzer</h1>
      </div>

      <div className="flex-1 px-6">
        <TestSummary 
          onCollapse={onCollapse} 
          onAnalysisStart={onAnalysisStart}
          onProcessStepChange={onProcessStepChange}
          showAnalysis={showAnalysis}
          currency={currency}
          onCurrencyChange={onCurrencyChange}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  )
} 