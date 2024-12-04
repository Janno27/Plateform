"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Download, ChevronDown, ListCollapse } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface RawDataTableProps {
  data: any
  currency: string
}

export function RawDataTable({ data }: RawDataTableProps) {
  const [activeDataset, setActiveDataset] = React.useState<'overall' | 'transaction'>('overall')
  const [collapsedColumns, setCollapsedColumns] = React.useState<{ [key: string]: boolean }>({})
  const [isAggregating, setIsAggregating] = React.useState(false)
  const [aggregatedData, setAggregatedData] = React.useState<any[] | null>(null)

  const handleAggregate = async () => {
    if (activeDataset !== 'transaction') return
    
    try {
      setIsAggregating(true)
      const response = await fetch('/api/aggregate-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data?.analysisData?.raw_data?.transaction || []),
      })

      if (!response.ok) throw new Error('Failed to aggregate data')
      
      const result = await response.json()
      setAggregatedData(result.data)
    } catch (error) {
      console.error('Error aggregating data:', error)
    } finally {
      setIsAggregating(false)
    }
  }

  const handleExport = () => {
    const currentData = data?.analysisData?.raw_data?.[activeDataset]
    if (!currentData) return
    const csv = convertToCSV(currentData)
    downloadCSV(csv, `${activeDataset}_data.csv`)
  }

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'string') return value.length > 30 ? `${value.slice(0, 30)}...` : value
    if (typeof value === 'number') return value.toLocaleString()
    return String(value)
  }

  const toggleColumn = (column: string) => {
    setCollapsedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  const currentData = activeDataset === 'transaction' && aggregatedData 
    ? aggregatedData 
    : data?.analysisData?.raw_data?.[activeDataset] || []

  const columns = currentData[0] ? Object.keys(currentData[0]) : []

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b p-4 bg-background z-30 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="dataset-switch"
              checked={activeDataset === 'transaction'}
              onCheckedChange={(checked) => {
                setActiveDataset(checked ? 'transaction' : 'overall')
                setAggregatedData(null)
              }}
            />
            <Label htmlFor="dataset-switch">
              {activeDataset === 'transaction' ? 'Transaction Data' : 'Overall Data'}
            </Label>
          </div>
          {activeDataset === 'transaction' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAggregate}
              disabled={isAggregating}
              className="ml-4"
            >
              <ListCollapse className="mr-2 h-4 w-4" />
              {isAggregating ? 'Aggregating...' : 'Aggregate Data'}
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 overflow-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="relative">
              {isAggregating ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[90%]" />
                    </div>
                  ))}
                </div>
              ) : (
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="sticky top-0 z-20 bg-background">
                      {columns.map((column) => (
                        <TableHead 
                          key={column} 
                          className={cn(
                            "whitespace-nowrap bg-background border-b",
                            collapsedColumns[column] && "w-12 !p-0"
                          )}
                          style={{ position: 'sticky', top: 0 }}
                        >
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 p-1 hover:bg-muted",
                                collapsedColumns[column] && "w-full h-full rounded-none"
                              )}
                              onClick={() => toggleColumn(column)}
                            >
                              <ChevronDown 
                                className={cn(
                                  "h-4 w-4 shrink-0 transition-transform",
                                  collapsedColumns[column] && "-rotate-90"
                                )}
                              />
                              {!collapsedColumns[column] && (
                                <span className="ml-2">
                                  {column.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                                </span>
                              )}
                            </Button>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((row: any, index: number) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell 
                            key={column}
                            className={cn(
                              "transition-all",
                              collapsedColumns[column] && "w-12 !p-2"
                            )}
                          >
                            <div className={cn(
                              "transition-all",
                              collapsedColumns[column] ? "opacity-0" : "opacity-100"
                            )}>
                              {formatCellValue(row[column])}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fonctions utilitaires pour l'export CSV
function convertToCSV(data: any[]): string {
  if (!data || !data.length) return ''
  
  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    }).join(',')
  )
  
  return [headers.join(','), ...rows].join('\n')
}

function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}