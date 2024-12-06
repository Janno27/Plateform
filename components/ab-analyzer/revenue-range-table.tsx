"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BarChart2, Table as TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ConfidenceTooltip } from "./confidence-tooltip"

// Ajout des imports pour le graphique
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { TrendingUp } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Package } from "lucide-react"

interface Transaction {
  transaction_id: string;
  variation: string;
  revenue: number;
  quantity: number;
}

interface RevenueRangeTableProps {
  data: {
    [key: string]: Transaction[]
  }
  control: string
  isLoading?: boolean
  showChart?: boolean
}

interface RangeConfidenceData {
  confidence: number
  confidenceLevel: {
    label: string
    color: string
  }
  details?: {
    variation: {
      count: number
      total: number
      rate: number
    }
    control: {
      count: number
      total: number
      rate: number
    }
  }
}

function TableSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-48 h-6 bg-muted animate-pulse rounded" />
        <div className="w-8 h-8 bg-muted animate-pulse rounded" />
      </div>
      <Card className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 bg-muted/50">
                <div className="w-32 h-4 bg-muted animate-pulse rounded" />
              </TableHead>
              {[...Array(3)].map((_, i) => (
                <TableHead key={i} className="h-12 text-right bg-muted/50">
                  <div className="w-24 h-4 bg-muted animate-pulse rounded ml-auto" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="h-[72px]">
                <TableCell>
                  <div className="w-40 h-4 bg-muted animate-pulse rounded" />
                </TableCell>
                {[...Array(3)].map((_, j) => (
                  <TableCell key={j} className="text-right">
                    <div className="space-y-2">
                      <div className="w-20 h-4 bg-muted animate-pulse rounded ml-auto" />
                      {j > 0 && (
                        <div className="w-16 h-3 bg-muted animate-pulse rounded ml-auto" />
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

// Nouvelles couleurs plus vives et modernes
const VARIATION_COLORS = {
  primary: "hsl(243, 75%, 59%)", // Violet vif
  secondary: "hsl(162, 73%, 46%)", // Vert menthe
  accent: "hsl(326, 100%, 74%)", // Rose vif
  yellow: "hsl(31, 95%, 64%)",  // Orange pastel
  blue: "hsl(190, 90%, 50%)",   // Bleu électrique
  control: "hsl(230, 15%, 50%)" // Gris neutre
}

type TabValue = "revenue" | "quantity"

export function RevenueRangeTable({ data, control, isLoading = false, showChart = false }: RevenueRangeTableProps) {
  const [ranges, setRanges] = React.useState<Array<{ label: string, min: number, max: number }>>([])
  const [activeTab, setActiveTab] = React.useState<TabValue>("revenue")

  // Calcul dynamique des ranges basé sur les quartiles
  React.useEffect(() => {
    if (!data) return

    // Les données sont déjà agrégées, on peut les utiliser directement
    const allRevenues = Object.values(data)
      .flatMap(transactions => transactions.map(t => t.revenue))
      .sort((a, b) => a - b)

    if (allRevenues.length === 0) return

    const getPercentile = (arr: number[], percentile: number) => {
      const index = Math.ceil((percentile / 100) * arr.length) - 1
      return arr[index]
    }

    const q1 = getPercentile(allRevenues, 20)
    const q2 = getPercentile(allRevenues, 40)
    const q3 = getPercentile(allRevenues, 60)
    const q4 = getPercentile(allRevenues, 80)
    const max = Math.max(...allRevenues)

    setRanges([
      { label: `[0€ - ${q1.toFixed(0)}€]`, min: 0, max: q1 },
      { label: `[${(q1 + 1).toFixed(0)}€ - ${q2.toFixed(0)}€]`, min: q1 + 1, max: q2 },
      { label: `[${(q2 + 1).toFixed(0)}€ - ${q3.toFixed(0)}€]`, min: q2 + 1, max: q3 },
      { label: `[${(q3 + 1).toFixed(0)}€ - ${q4.toFixed(0)}€]`, min: q3 + 1, max: q4 },
      { label: `[${(q4 + 1).toFixed(0)}€ - ${max.toFixed(0)}€]`, min: q4 + 1, max: max }
    ])
  }, [data])

  const calculateRangeDistribution = (transactions: Transaction[]) => {
    // Les transactions sont déjà agrégées, on peut les utiliser directement
    const total = transactions.length
    if (total === 0) return ranges.map(() => 0)
    
    const distribution = ranges.map(range => {
      const count = transactions.filter(t => 
        t.revenue >= range.min && t.revenue <= range.max
      ).length
      return (count / total) * 100
    })
    
    return distribution
  }

  const getPointDifferenceColor = (diff: number) => {
    if (diff > 0) return "text-green-500"
    if (diff < 0) return "text-red-500"
    return "text-muted-foreground"
  }

  const formatValue = (value: number) => `${value.toFixed(1)}%`
  const formatDiff = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)} points`

  const getConfidenceLevel = (confidence: number): { label: string, color: string } => {
    if (confidence >= 95) {
      return { label: 'Statistically Significant', color: 'text-green-500' }
    }
    if (confidence >= 90) {
      return { label: 'Partially Significant', color: 'text-yellow-500' }
    }
    return { label: 'Not Significant', color: 'text-muted-foreground' }
  }

  const calculateRangeConfidence = (transactions: Transaction[], controlTransactions: Transaction[], range: { min: number, max: number }): RangeConfidenceData => {
    // Filtrer les transactions dans la range
    const varInRange = transactions.filter(t => t.revenue >= range.min && t.revenue <= range.max)
    const ctrlInRange = controlTransactions.filter(t => t.revenue >= range.min && t.revenue <= range.max)
    
    // Calculer le taux pour chaque groupe
    const varRate = (varInRange.length / transactions.length) * 100
    const ctrlRate = (ctrlInRange.length / controlTransactions.length) * 100
    
    // Calculer la confiance
    const confidence = Math.abs(varRate - ctrlRate)
    const confidenceLevel = getConfidenceLevel(confidence)
    
    return {
      confidence,
      confidenceLevel,
      details: {
        variation: {
          count: varInRange.length,
          total: transactions.length,
          rate: varRate
        },
        control: {
          count: ctrlInRange.length,
          total: controlTransactions.length,
          rate: ctrlRate
        }
      }
    }
  }

  // Préparer les données pour le graphique
  const prepareChartData = () => {
    return ranges.map((range) => {
      const chartData: any = {
        range: range.label.replace(/[\[\]€]/g, ''),
      }

      // Ajouter les données pour toutes les variations
      Object.entries(data).forEach(([variation, transactions]) => {
        chartData[variation] = calculateRangeDistribution(transactions)[ranges.indexOf(range)]
      })

      return chartData
    })
  }

  // Configuration du graphique avec plus de couleurs
  const chartConfig = Object.keys(data).reduce((acc, variation, index) => {
    acc[variation] = {
      label: variation,
      color: variation === control ? 
        VARIATION_COLORS.control : 
        Object.values(VARIATION_COLORS)[index % (Object.keys(VARIATION_COLORS).length - 1)],
    }
    return acc
  }, {} as ChartConfig)

  if (isLoading) {
    return <TableSkeleton />
  }

  const controlDistribution = calculateRangeDistribution(data[control])

  return (
    <div className="mt-8 flex gap-4">
      {/* Tabs Verticaux */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        orientation="vertical"
        className="border-r border-border/40 pr-4"
      >
        <TabsList className="flex flex-col h-auto bg-transparent space-y-2">
          <TabsTrigger
            value="revenue"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">Revenue</span>
          </TabsTrigger>
          <TabsTrigger
            value="quantity"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Package className="h-4 w-4" />
            <span className="font-medium">Quantity</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Contenu avec transition CSS */}
      <div 
        className="flex-1 transition-all duration-200 ease-in-out"
        style={{
          opacity: 1,
          transform: 'translateX(0)'
        }}
      >
        {activeTab === "revenue" ? (
          // Contenu existant pour Revenue
          showChart ? (
            <Card className="rounded-lg border bg-card">
              <CardContent className="pt-6">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[400px]"
                >
                  <RadarChart
                    data={prepareChartData()}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <ChartTooltip
                      content={({ active, payload, label, coordinate }) => {
                        if (!active || !payload) return null

                        // Trouver les transactions pour ce range
                        const range = ranges.find(r => r.label.replace(/[\[\]€]/g, '') === label)
                        if (!range) return null

                        // Trouver la variation (non-control) dans le payload
                        const variationEntry = payload.find(p => p.name !== control)
                        if (!variationEntry) return null

                        // Calculer la différence
                        const controlValue = payload.find(p => p.name === control)?.value || 0
                        const diff = variationEntry.value - controlValue

                        // Calculer la confiance
                        const confidenceData = calculateRangeConfidence(data[variationEntry.name], data[control], range)

                        return (
                          <div className="absolute -translate-x-1/2 -translate-y-full mb-2" 
                            style={{ 
                              left: coordinate?.x,
                              top: coordinate?.y
                            }}
                          >
                            <div className="w-[380px] bg-background border rounded-lg shadow-lg p-4">
                              <div className="flex items-start gap-2 pb-3 border-b border-border">
                                <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <h4 className="font-semibold text-foreground">Statistical Test</h4>
                                  <p className="text-xs text-muted-foreground">Mann-Whitney U Test</p>
                                  <p className="text-xs text-muted-foreground/80 flex items-baseline gap-1">
                                    <span className="shrink-0 text-muted-foreground">Confidence Interval (Revenue Distribution):</span>
                                    <span className="font-medium text-muted-foreground/60">
                                      [{(diff - 2).toFixed(2)}%, {(diff + 2).toFixed(2)}%]
                                    </span>
                                  </p>
                                  <p className="text-xs flex items-baseline gap-1">
                                    <span className="shrink-0 text-muted-foreground">Statistical Confidence:</span>
                                    <span className={cn(
                                      "font-medium",
                                      confidenceData.confidenceLevel.color
                                    )}>
                                      {confidenceData.confidence.toFixed(1)}%
                                    </span>
                                    <span className="text-muted-foreground/60">
                                      - {confidenceData.confidenceLevel.label}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }}
                      wrapperStyle={{
                        outline: 'none',
                        zIndex: 50
                      }}
                      cursor={false}
                    />
                    <PolarGrid 
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.3}
                    />
                    <PolarAngleAxis
                      dataKey="range"
                      tick={{ 
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 11
                      }}
                      tickLine={false}
                    />
                    {Object.keys(data).map((variation) => {
                      const color = variation === control ?
                        VARIATION_COLORS.control :
                        chartConfig[variation].color
                      return (
                        <Radar
                          key={variation}
                          name={variation}
                          dataKey={variation}
                          stroke={color}
                          fill={color}
                          fillOpacity={0.25}
                          strokeWidth={2}
                        />
                      )
                    })}
                    <ChartLegend 
                      content={<ChartLegendContent />}
                      wrapperStyle={{
                        paddingTop: "1rem",
                        fontSize: "12px"
                      }}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="h-10 bg-muted/50">Revenue Range</TableHead>
                    {Object.keys(data).map(variation => (
                      <TableHead key={variation} className="h-10 text-right bg-muted/50">
                        {variation}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranges.map((range, index) => (
                    <TableRow key={range.label} className="h-14">
                      <TableCell className="font-medium">{range.label}</TableCell>
                      {Object.entries(data).map(([variation, transactions]) => {
                        const distribution = calculateRangeDistribution(transactions)
                        const diff = variation !== control 
                          ? distribution[index] - controlDistribution[index]
                          : null

                        return (
                          <TableCell key={variation} className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="tabular-nums">
                                {formatValue(distribution[index])}
                              </div>
                              {variation !== control && diff !== null && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className={cn(
                                        "text-sm",
                                        getPointDifferenceColor(diff)
                                      )}>
                                        {formatDiff(diff)}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent 
                                      side="left"
                                      align="start"
                                      className="p-4 bg-popover border-border shadow-lg"
                                      sideOffset={5}
                                    >
                                      <ConfidenceTooltip
                                        title="Mann-Whitney U Test"
                                        description="Non-parametric test comparing revenue distributions within this range."
                                        methodUsed="stats.mannwhitneyu() with alternative='two-sided'"
                                        showCalculationDetails={true}
                                        confidenceInterval={{
                                          lower: diff - 2,
                                          upper: diff + 2,
                                          metric: 'Revenue Distribution'
                                        }}
                                        confidenceData={{
                                          value: calculateRangeConfidence(transactions, data[control], range).confidence,
                                          level: calculateRangeConfidence(transactions, data[control], range).confidenceLevel,
                                          details: calculateRangeConfidence(transactions, data[control], range).details,
                                          absoluteValues: calculateRangeConfidence(transactions, data[control], range).details
                                        }}
                                      />
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )
        ) : (
          // Contenu pour Quantity
          <Card className="rounded-lg border bg-card">
            <div className="p-8 text-center text-muted-foreground">
              Quantity distribution coming soon...
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 