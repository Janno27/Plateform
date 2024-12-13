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
  onFilterChange: (filterType: keyof Filter, value: string) => void
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
    <div className={cn(
      "flex flex-col h-full",
      "overflow-hidden" // Ajout pour contrôler le scroll
    )}>
      <div className="p-6 flex-none"> {/* Ajout de flex-none */}
        <h1 className="text-3xl font-bold tracking-tight">A/B Test Analyzer</h1>
      </div>

      <div className={cn(
        "flex-1 px-6",
        "min-h-0", // Ajout pour permettre le scroll dans TestSummary
        "overflow-hidden" // Ajout pour contrôler le scroll
      )}>
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