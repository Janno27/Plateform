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
import { ArrowUpIcon, ArrowDownIcon, InfoIcon, AlertCircle, TrendingUp, BarChart3, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { ConfidenceTooltip } from "./confidence-tooltip"

interface OverviewTableProps {
  data: any
  isLoading: boolean
}

export function OverviewTable({ data, isLoading }: OverviewTableProps) {
  const [removeOutliers, setRemoveOutliers] = React.useState(false)
  const [processedData, setProcessedData] = React.useState<any>(null)

  const formatValue = (value: number, type: string) => {
    if (type === 'uplift') {
      return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
    }
    if (type === 'rate' || type === 'confidence') {
      return `${value.toFixed(2)}%`;
    }
    if (type === 'revenue') {
      return `€${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString();
  };

  const getUpliftColor = (uplift: number) => {
    return uplift > 0 ? 'text-green-500' : 'text-red-500';
  };

  type MetricKey = 'users' | 'add_to_cart_rate' | 'transaction_rate' | 'revenue';

  const getUpliftTooltip = (metricKey: MetricKey) => {
    const tooltips: Record<MetricKey, string> = {
      users: "Difference relative of the number of users between the variation and the control",
      add_to_cart_rate: "Difference relative of the add-to-cart rate between the variation and the control",
      transaction_rate: "Difference relative of the conversion rate between the variation and the control",
      revenue: "Difference relative of the average revenue per user between the variation and the control"
    };
    return tooltips[metricKey];
  };

  const getConfidenceTooltip = (metricKey: MetricKey) => {
    const tooltips: Record<MetricKey, string> = {
      users: "Student's t-test: Compares means between two independent samples",
      add_to_cart_rate: "Fisher's exact test: Compares proportions between two independent groups",
      transaction_rate: "Fisher's exact test: Compares proportions between two independent groups",
      revenue: "Mann-Whitney U test: Compares distributions between two independent samples (suitable for non-normal data)"
    };
    return tooltips[metricKey];
  };

  // Fonction pour détecter les outliers en utilisant l'écart interquartile (IQR)
  const detectOutliers = React.useCallback((values: number[]): boolean[] => {
    const sorted = [...values].sort((a, b) => a - b)
    const q1 = sorted[Math.floor(sorted.length * 0.25)]
    const q3 = sorted[Math.floor(sorted.length * 0.75)]
    const iqr = q3 - q1
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr
    return values.map(v => v < lowerBound || v > upperBound)
  }, [])

  // Fonction pour traiter les données et gérer les outliers
  const processData = React.useCallback((rawData: any, excludeOutliers: boolean) => {
    if (!rawData?.data) return null

    const processed = { ...rawData }
    if (!excludeOutliers) return processed

    // Collecter toutes les valeurs par métrique
    const metricValues: Record<string, number[]> = {}
    Object.values(processed.data).forEach((variation: any) => {
      Object.entries(variation).forEach(([metric, data]: [string, any]) => {
        if (!metricValues[metric]) metricValues[metric] = []
        if (data.value !== undefined) metricValues[metric].push(data.value)
      })
    })

    // Détecter les outliers pour chaque métrique
    const metricOutliers: Record<string, boolean[]> = {}
    Object.entries(metricValues).forEach(([metric, values]) => {
      metricOutliers[metric] = detectOutliers(values)
    })

    // Filtrer les outliers
    Object.entries(processed.data).forEach(([variation, metrics]: [string, any]) => {
      Object.entries(metrics).forEach(([metric, data]: [string, any]) => {
        const valueIndex = metricValues[metric].indexOf(data.value)
        if (metricOutliers[metric][valueIndex]) {
          // Réinitialiser les valeurs pour les outliers
          metrics[metric] = {
            ...data,
            uplift: 0,
            confidence: 0
          }
        }
      })
    })

    return processed
  }, [detectOutliers])

  // Mettre à jour les données quand le switch change
  React.useEffect(() => {
    const newData = processData(data, removeOutliers)
    setProcessedData(newData)
  }, [data, removeOutliers, processData])

  // Fonction pour calculer les statistiques des outliers
  const getOutliersStats = React.useMemo(() => {
    if (!data?.data) return null

    const stats: Record<string, { total: number; outliers: number }> = {}
    const processed = processData(data, true) // Simuler le traitement avec outliers activés

    Object.entries(processed.data).forEach(([variation, metrics]: [string, any]) => {
      stats[variation] = {
        total: Object.keys(metrics).length,
        outliers: Object.values(metrics).filter((m: any) => m.confidence === 0).length
      }
    })

    return stats
  }, [data, processData])

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

  if (!data?.success || !data?.data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    );
  }

  // Inclure le contrôle dans le tableau
  const allVariations = {
    [data.control]: {
      users: {
        value: data.data[Object.keys(data.data)[0]]?.users?.control_value || 0,
        uplift: 0,
        confidence: 0
      },
      add_to_cart_rate: {
        value: data.data[Object.keys(data.data)[0]]?.add_to_cart_rate?.control_value || 0,
        uplift: 0,
        confidence: 0
      },
      transaction_rate: {
        value: data.data[Object.keys(data.data)[0]]?.transaction_rate?.control_value || 0,
        uplift: 0,
        confidence: 0
      },
      revenue: {
        value: data.data[Object.keys(data.data)[0]]?.revenue?.control_value || 0,
        uplift: 0,
        confidence: 0
      }
    },
    ...data.data
  };

  const metrics = [
    { key: 'users', label: 'Users', type: 'number', showStats: false },
    { key: 'add_to_cart_rate', label: 'Add to Cart Rate', type: 'rate', showStats: true },
    { key: 'transaction_rate', label: 'Transaction Rate', type: 'rate', showStats: true },
    { key: 'revenue', label: 'Revenue', type: 'revenue', showStats: true }
  ];

  // Fonction pour déterminer si une valeur est la plus élevée
  const isHighestValue = (metric: string, value: number, allValues: any) => {
    const values = Object.values(allValues).map((m: any) => m[metric]?.value || 0);
    return value === Math.max(...values);
  };

  const renderOutliersTooltip = () => (
    <div className="w-[350px] max-w-[90vw] p-4 text-left">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
        <BarChart3 className="h-5 w-5 text-primary shrink-0" />
        <h4 className="font-semibold text-foreground">Outliers Statistics</h4>
      </div>
      <div className="space-y-4">
        {getOutliersStats && Object.entries(getOutliersStats).map(([variation, stats]) => (
          <div key={variation} className="space-y-1">
            <span className="font-medium text-foreground">{variation}</span>
            <div className="text-sm text-muted-foreground">
              {stats.outliers} outliers out of {stats.total} metrics
              <span className="ml-1 text-foreground">
                ({((stats.outliers / stats.total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
        <div className="pt-3 mt-1 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Outliers are detected using the Interquartile Range (IQR) method.
            A value is considered an outlier if it falls outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR].
          </p>
        </div>
      </div>
    </div>
  )

  const renderConfidenceTooltip = (metricKey: MetricKey, metricsData: any) => (
    <ConfidenceTooltip
      title={getConfidenceTooltip(metricKey)}
      description={getConfidenceTooltip(metricKey)}
      confidenceInterval={{
        lower: metricsData.confidence_interval?.lower || 0,
        upper: metricsData.confidence_interval?.upper || 0,
        metric: metrics.find(m => m.key === metricKey)?.label || ''
      }}
    />
  )

  return (
    <div className="space-y-4 px-6">
      <div className="flex justify-end">
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help text-muted-foreground hover:text-muted-foreground/80 transition-colors">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Outliers Statistics</span>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="left"
                align="start"
                className="p-0 bg-popover border-border shadow-lg"
                sideOffset={5}
              >
                {renderOutliersTooltip()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center space-x-2">
            <Switch
              id="remove-outliers"
              checked={removeOutliers}
              onCheckedChange={setRemoveOutliers}
            />
            <Label htmlFor="remove-outliers">Exclude outliers</Label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 bg-muted/50">Variation</TableHead>
              {metrics.map(metric => (
                <TableHead key={metric.key} className="h-12 text-right bg-muted/50">
                  {metric.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(allVariations).map(([variation, metrics_data]: [string, any], index) => (
              <TableRow 
                key={variation} 
                className={cn(
                  "h-[72px] hover:bg-muted/50 transition-colors",
                  index === 0 && "bg-muted/30"
                )}
              >
                <TableCell className="font-medium">{variation}</TableCell>
                {metrics.map(metric => (
                  <TableCell key={metric.key} className="text-right p-4">
                    <div className="space-y-1.5">
                      <div className={cn(
                        "tabular-nums",
                        isHighestValue(metric.key, metrics_data[metric.key].value, allVariations) && "font-semibold"
                      )}>
                        {formatValue(metrics_data[metric.key].value, metric.type)}
                      </div>
                      {variation !== data.control && metric.showStats && (
                        <>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <div className="space-y-1.5">
                                  <div className={cn(
                                    "text-sm flex items-center justify-end gap-1 cursor-help transition-colors",
                                    getUpliftColor(metrics_data[metric.key].uplift)
                                  )}>
                                    {metrics_data[metric.key].uplift > 0 ? (
                                      <ArrowUpIcon className="h-4 w-4" />
                                    ) : (
                                      <ArrowDownIcon className="h-4 w-4" />
                                    )}
                                    {formatValue(metrics_data[metric.key].uplift, 'uplift')}
                                  </div>
                                  <div className={cn(
                                    "text-xs text-muted-foreground hover:text-muted-foreground/80 transition-colors"
                                  )}>
                                    Stats : {formatValue(metrics_data[metric.key].confidence, 'confidence')}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="left"
                                align="start"
                                className="p-4 bg-popover border-border shadow-lg"
                                sideOffset={5}
                              >
                                {renderConfidenceTooltip(metric.key as MetricKey, metrics_data)}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 