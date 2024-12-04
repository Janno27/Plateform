"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface OverviewTableProps {
  data: any
  isLoading: boolean
}

export function OverviewTable({ data, isLoading }: OverviewTableProps) {
  console.log('Overview table data:', data)

  const formatValue = (value: number, type: string) => {
    if (type === 'uplift') {
      return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
    }
    if (type === 'confidence') {
      return `${value.toFixed(2)}%`
    }
    return value.toLocaleString()
  }

  const getUpliftColor = (uplift: number, confidence: number) => {
    if (confidence < 95) return 'text-muted-foreground'
    return uplift > 0 ? 'text-green-500' : 'text-red-500'
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (!data?.success || !data?.data || Object.keys(data.data).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    )
  }

  const metrics = [
    { key: 'users', label: 'Users' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'conversion', label: 'Conversion Rate' },
    { key: 'revenue', label: 'Revenue' }
  ]

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Variation</TableHead>
            {metrics.map(metric => (
              <TableHead key={metric.key} className="text-right">
                {metric.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(data?.data || {}).map(([variation, metrics]: [string, any]) => (
            <TableRow key={variation}>
              <TableCell className="font-medium">{variation}</TableCell>
              {Object.entries(metrics).map(([metric, values]: [string, any]) => (
                <TableCell key={metric} className="text-right">
                  <div className="space-y-1">
                    <div className={cn(
                      "flex items-center justify-end gap-1",
                      getUpliftColor(values.uplift, values.confidence)
                    )}>
                      {values.uplift > 0 ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                      {formatValue(values.uplift, 'uplift')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatValue(values.confidence, 'confidence')} conf.
                    </div>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 