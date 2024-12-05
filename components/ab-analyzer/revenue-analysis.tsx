"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Info, ArrowUp as ArrowUpIcon, ArrowDown as ArrowDownIcon } from "lucide-react"
import { ConfidenceTooltip } from "./confidence-tooltip"

interface RevenueAnalysisProps {
  data: any
  isLoading?: boolean
}

const TOOLTIPS = {
  uplift: {
    title: "Statistical Test",
    description: "Relative difference between variation and control",
    confidenceLevels: [
      {
        level: "≥ 95%",
        label: "Statistically Significant",
        color: "text-green-500"
      },
      {
        level: "≥ 90%",
        label: "Partially Significant",
        color: "text-yellow-500"
      },
      {
        level: "< 90%",
        label: "Not Significant",
        color: "text-muted-foreground"
      }
    ]
  }
}

const STATISTICAL_METHODOLOGY = {
  users: {
    test: "Student's t-test",
    description: "Compares the mean number of users between variations. Assumes normal distribution due to large sample size (Central Limit Theorem).",
    implementation: "stats.ttest_ind() with equal_var=False (Welch's t-test)"
  },
  transaction_rate: {
    test: "Fisher's Exact Test",
    description: "Compares conversion rates between variations. Ideal for binary outcomes (converted vs not converted).",
    implementation: "stats.fisher_exact() for precise probability calculation"
  },
  aov: {
    test: "Mann-Whitney U Test",
    description: "Non-parametric test comparing AOV distributions. Robust against non-normal distributions and outliers.",
    implementation: "stats.mannwhitneyu() with alternative='two-sided'"
  },
  avg_products: {
    test: "Mann-Whitney U Test",
    description: "Non-parametric test for comparing product quantity distributions. Handles discrete, non-normal data.",
    implementation: "stats.mannwhitneyu() with alternative='two-sided'"
  },
  total_revenue: {
    test: "Mann-Whitney U Test",
    description: "Non-parametric test for comparing revenue distributions. Robust against typical revenue data skewness.",
    implementation: "stats.mannwhitneyu() with alternative='two-sided'"
  },
  arpu: {
    test: "Mann-Whitney U Test",
    description: "Non-parametric test comparing revenue per user distributions. Accounts for individual user revenue patterns.",
    implementation: "stats.mannwhitneyu() with alternative='two-sided'"
  }
}

// Définir les metrics au niveau du module
const metrics = [
  { key: 'users', label: 'Users', type: 'number', showStats: true },
  { key: 'transaction_rate', label: 'Transaction Rate', type: 'rate', showStats: true },
  { key: 'aov', label: 'AOV', type: 'currency', showStats: true },
  { key: 'avg_products', label: 'Avg Products', type: 'number', showStats: true }
] as const;

const secondaryMetrics = [
  { key: 'total_revenue', label: 'Total Revenue', type: 'currency', showStats: true },
  { key: 'arpu', label: 'ARPU', type: 'currency', showStats: true }
] as const;

// Type pour les métriques
type MetricKey = typeof metrics[number]['key'] | typeof secondaryMetrics[number]['key'];

const renderConfidenceTooltip = (metric: MetricKey, metricsData: any) => {
  const metricInfo = [...metrics, ...secondaryMetrics].find(m => m.key === metric);
  
  return (
    <ConfidenceTooltip
      title={STATISTICAL_METHODOLOGY[metric as keyof typeof STATISTICAL_METHODOLOGY].test}
      description={STATISTICAL_METHODOLOGY[metric as keyof typeof STATISTICAL_METHODOLOGY].description}
      methodUsed={STATISTICAL_METHODOLOGY[metric as keyof typeof STATISTICAL_METHODOLOGY].implementation}
      confidenceInterval={{
        lower: metricsData.confidence_interval?.lower || 0,
        upper: metricsData.confidence_interval?.upper || 0,
        metric: metricInfo?.label || ''
      }}
    />
  )
}

export function RevenueAnalysis({ data, isLoading = false }: RevenueAnalysisProps) {
  const [deviceFilter, setDeviceFilter] = React.useState<string>("all")
  const [revenueData, setRevenueData] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)

  // Références pour les mesures de position
  const tableRef = React.useRef<HTMLDivElement>(null)
  const aovColumnRef = React.useRef<HTMLTableCellElement>(null)
  
  // États pour les positions
  const [positions, setPositions] = React.useState({
    aovColPosition: 0,
    tableHeight: 0,
    leftTablePosition: 0,
    rightTablePosition: 0
  })

  // Fonction pour calculer les positions
  const calculatePositions = React.useCallback(() => {
    if (tableRef.current && aovColumnRef.current) {
      const tableRect = tableRef.current.getBoundingClientRect()
      const aovRect = aovColumnRef.current.getBoundingClientRect()
      
      // Calculer les positions relatives au conteneur parent
      const aovColPosition = aovRect.left - tableRect.left + (aovRect.width / 2)
      const tableHeight = tableRect.height
      const containerWidth = tableRect.width
      
      setPositions({
        aovColPosition,
        tableHeight,
        leftTablePosition: containerWidth * 0.25,
        rightTablePosition: containerWidth * 0.75
      })
    }
  }, [])

  // Observer les changements de taille
  React.useEffect(() => {
    const observer = new ResizeObserver(calculatePositions)
    
    if (tableRef.current) {
      observer.observe(tableRef.current)
    }

    return () => observer.disconnect()
  }, [calculatePositions])

  // Recalculer les positions quand les données changent
  React.useEffect(() => {
    calculatePositions()
  }, [revenueData, calculatePositions])

  React.useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setError(null)
        const requestData = {
          overall: data?.analysisData?.raw_data?.overall || [],
          transaction: data?.analysisData?.raw_data?.transaction || []
        }
        
        console.log('Sending data to revenue endpoint:', requestData)
        
        const response = await fetch('http://localhost:8000/calculate-revenue', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        const result = await response.json()
        
        console.log('Revenue calculation response:', result)

        if (!response.ok) {
          throw new Error(result.detail || 'Failed to fetch revenue data')
        }

        if (!result.success) {
          throw new Error(result.error || 'Invalid response format')
        }

        setRevenueData(result)
      } catch (error) {
        console.error('Error fetching revenue data:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      }
    }

    if (data?.analysisData?.raw_data) {
      fetchRevenueData()
    }
  }, [data])

  const formatValue = (value: number, type: string) => {
    if (type === 'uplift') {
      return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
    }
    if (type === 'rate' || type === 'confidence') {
      return `${value.toFixed(2)}%`
    }
    if (type === 'currency') {
      return `€${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return value.toLocaleString()
  }

  const getUpliftColor = (uplift: number) => {
    return uplift > 0 ? 'text-green-500' : 'text-red-500'
  }

  // Fonction pour déterminer la valeur la plus élevée
  const getHighestValue = (metric: string) => {
    if (!revenueData?.data) return 0;
    return Math.max(...Object.values(revenueData.data).map((m: any) => m[metric].value));
  };

  // Fonction pour vérifier si une valeur est la plus élevée
  const isHighestValue = (metric: string, value: number) => {
    return value === getHighestValue(metric);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-[300px] h-10 bg-muted animate-pulse rounded-md" />
          <div className="w-[200px] h-10 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-12 bg-muted animate-pulse rounded-md" />
          <div className="h-12 bg-muted animate-pulse rounded-md" />
          <div className="h-12 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 text-red-500">
        <div className="text-center">
          <p className="font-semibold">Error loading revenue data</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!revenueData?.success || !revenueData?.data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-end">
        <Select
          value={deviceFilter}
          onValueChange={setDeviceFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tableau principal avec connexions */}
      <div ref={tableRef} className="relative">
        <Card className="rounded-lg border bg-card relative z-10">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="h-12 bg-muted/50">Variation</TableHead>
                {metrics.map(metric => (
                  <TableHead 
                    key={metric.key} 
                    className="h-12 text-right bg-muted/50"
                    ref={metric.key === 'aov' ? aovColumnRef : undefined}
                  >
                    {metric.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(revenueData.data).map(([variation, metrics_data]: [string, any], index) => (
                <TableRow 
                  key={variation}
                  className={cn(
                    "h-[72px] hover:bg-muted/50 transition-colors",
                    variation === revenueData.control && "bg-muted/30"
                  )}
                >
                  <TableCell className="font-medium">{variation}</TableCell>
                  {metrics.map(metric => (
                    <TableCell key={metric.key} className="text-right p-4">
                      <div className="space-y-1.5">
                        <div className={cn(
                          "tabular-nums",
                          isHighestValue(metric.key, metrics_data[metric.key].value) && "font-semibold"
                        )}>
                          {formatValue(metrics_data[metric.key].value, metric.type)}
                        </div>
                        {variation !== revenueData.control && metric.key !== 'users' && (
                          <div className="space-y-1.5">
                            <div className={cn(
                              "text-sm flex items-center justify-end gap-1 cursor-help",
                              getUpliftColor(metrics_data[metric.key].uplift)
                            )}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="flex items-center gap-1">
                                    {metrics_data[metric.key].uplift > 0 ? (
                                      <ArrowUpIcon className="h-4 w-4" />
                                    ) : (
                                      <ArrowDownIcon className="h-4 w-4" />
                                    )}
                                    {formatValue(metrics_data[metric.key].uplift, 'uplift')}
                                  </TooltipTrigger>
                                  <TooltipContent 
                                    side="left"
                                    align="start"
                                    className="p-4 bg-popover border-border shadow-lg"
                                    sideOffset={5}
                                  >
                                    {renderConfidenceTooltip(metric.key, metrics_data[metric.key])}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-xs text-muted-foreground cursor-help">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    Stats : {formatValue(metrics_data[metric.key].confidence, 'confidence')}
                                  </TooltipTrigger>
                                  <TooltipContent 
                                    side="left"
                                    align="start"
                                    className="p-4 bg-popover border-border shadow-lg"
                                    sideOffset={5}
                                  >
                                    {renderConfidenceTooltip(metric.key, metrics_data[metric.key])}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Connexions visuelles */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="w-full h-full"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {/* Courbe gauche */}
            <path
              d={`
                M ${positions.aovColPosition},${positions.tableHeight} 
                C ${positions.aovColPosition},${positions.tableHeight + 40}
                  ${positions.leftTablePosition + 100},${positions.tableHeight + 40}
                  ${positions.leftTablePosition + 100},${positions.tableHeight + 80}
              `}
              stroke="var(--border)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 4"
            />

            {/* Point de départ (AOV) */}
            <circle
              cx={positions.aovColPosition}
              cy={positions.tableHeight}
              r="3"
              fill="var(--border)"
              opacity="0.7"
            />

            {/* Point d'arrivée (Revenue) */}
            <circle
              cx={positions.leftTablePosition + 100}
              cy={positions.tableHeight + 80}
              r="3"
              fill="var(--border)"
              opacity="0.7"
            />

            {/* Courbe droite */}
            <path
              d={`
                M ${positions.aovColPosition},${positions.tableHeight} 
                C ${positions.aovColPosition},${positions.tableHeight + 40}
                  ${positions.rightTablePosition - 100},${positions.tableHeight + 40}
                  ${positions.rightTablePosition - 100},${positions.tableHeight + 80}
              `}
              stroke="var(--border)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 4"
            />

            {/* Point d'arrivée (ARPU) */}
            <circle
              cx={positions.rightTablePosition - 100}
              cy={positions.tableHeight + 80}
              r="3"
              fill="var(--border)"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* Tableaux secondaires */}
      <div className="grid grid-cols-2 gap-4 relative mt-8">
        {secondaryMetrics.map((metric, index) => (
          <Card 
            key={metric.key} 
            className="rounded-lg border bg-card"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="h-12 bg-muted/50">Variation</TableHead>
                  <TableHead className="h-12 text-right bg-muted/50">
                    {metric.label}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(revenueData.data).map(([variation, metrics_data]: [string, any]) => (
                  <TableRow 
                    key={variation}
                    className={cn(
                      "h-[72px] hover:bg-muted/50 transition-colors",
                      variation === revenueData.control && "bg-muted/30"
                    )}
                  >
                    <TableCell className="font-medium">{variation}</TableCell>
                    <TableCell className="text-right p-4">
                      <div className="space-y-1.5">
                        <div className="tabular-nums">
                          {formatValue(metrics_data[metric.key].value, metric.type)}
                        </div>
                        {variation !== revenueData.control && metric.key !== 'users' && (
                          <div className="space-y-1.5">
                            <div className={cn(
                              "text-sm flex items-center justify-end gap-1 cursor-help",
                              getUpliftColor(metrics_data[metric.key].uplift)
                            )}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="flex items-center gap-1">
                                    {metrics_data[metric.key].uplift > 0 ? (
                                      <ArrowUpIcon className="h-4 w-4" />
                                    ) : (
                                      <ArrowDownIcon className="h-4 w-4" />
                                    )}
                                    {formatValue(metrics_data[metric.key].uplift, 'uplift')}
                                  </TooltipTrigger>
                                  <TooltipContent 
                                    side="left"
                                    align="start"
                                    className="p-4 bg-popover border-border shadow-lg"
                                    sideOffset={5}
                                  >
                                    {renderConfidenceTooltip(metric.key, metrics_data[metric.key])}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-xs text-muted-foreground cursor-help">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    Stats : {formatValue(metrics_data[metric.key].confidence, 'confidence')}
                                  </TooltipTrigger>
                                  <TooltipContent 
                                    side="left"
                                    align="start"
                                    className="p-4 bg-popover border-border shadow-lg"
                                    sideOffset={5}
                                  >
                                    {renderConfidenceTooltip(metric.key, metrics_data[metric.key])}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>
    </div>
  )
} 