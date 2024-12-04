// statistics-panel.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { RawDataTable } from "./raw-data-table"
import { OverviewTable } from "./overview-table"

interface StatisticsPanelProps {
  testData: any
  currency: string
  filters: {
    device_category: string[]
    item_category2: string[]
  }
  results: any
  isCollapsed: boolean
}

export function StatisticsPanel({
  testData,
  currency,
  filters,
  results,
  isCollapsed
}: StatisticsPanelProps) {
  const [overviewData, setOverviewData] = React.useState<any>(null)
  const [isLoadingOverview, setIsLoadingOverview] = React.useState(false)

  const fetchOverviewData = React.useCallback(async () => {
    try {
      setIsLoadingOverview(true)
      const dataToSend = {
        overall: testData?.analysisData?.raw_data?.overall || [],
        transaction: testData?.analysisData?.raw_data?.transaction || []
      }
      
      if (!dataToSend.overall.length) {
        console.error('No overall data available')
        return
      }
      
      console.log('Overall data sample:', dataToSend.overall[0])
      console.log('Transaction data sample:', dataToSend.transaction[0])
      
      const response = await fetch('http://localhost:8000/calculate-overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error(errorData.detail || 'Failed to fetch overview data')
      }
      
      const result = await response.json()
      console.log('Received overview data:', result)
      setOverviewData(result)
    } catch (error) {
      console.error('Error fetching overview data:', error)
    } finally {
      setIsLoadingOverview(false)
    }
  }, [testData])

  React.useEffect(() => {
    if (testData?.analysisData?.raw_data?.overall) {
      fetchOverviewData()
    }
  }, [testData, fetchOverviewData])

  return (
    <Card 
      className={cn(
        "h-full", // Take full height of parent
        "transition-all duration-300",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
        isCollapsed ? "w-[calc(100%-200px)]" : "w-full"
      )}
    >
      <Tabs defaultValue="overview" className="h-full flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <TabsContent value="overview" className="p-6">
            <OverviewTable 
              data={overviewData} 
              isLoading={isLoadingOverview}
            />
          </TabsContent>

          <TabsContent value="engagement" className="p-6 absolute inset-0">
            Engagement content
          </TabsContent>

          <TabsContent value="funnel" className="p-6 absolute inset-0">
            Funnel content
          </TabsContent>

          <TabsContent value="revenue" className="p-6 absolute inset-0">
            Revenue content
          </TabsContent>

          <TabsContent 
            value="raw" 
            className="absolute inset-0 overflow-hidden"
          >
            <RawDataTable data={testData} currency={currency} />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  )
}