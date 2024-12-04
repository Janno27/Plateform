// statistics-panel.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { RawDataTable } from "./raw-data-table"

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
          <TabsContent value="overview" className="p-6 absolute inset-0">
            Overview content
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