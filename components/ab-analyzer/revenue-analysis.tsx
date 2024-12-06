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
import { RevenueRangeTable } from "./revenue-range-table"
import { Button } from "@/components/ui/button"
import { BarChart2, TableIcon } from "lucide-react"
import { Check } from "lucide-react"

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
  
  let absoluteValues;
  switch (metric) {
    case 'transaction_rate':
      absoluteValues = {
        variation: {
          numerator: metricsData.value || 0,
          denominator: metricsData.total || 0,
          label: 'Transactions/Users'
        },
        control: {
          numerator: metricsData.control_value || 0,
          denominator: metricsData.control_total || 0,
          label: 'Transactions/Users'
        }
      };
      break;
    case 'arpu':
      absoluteValues = {
        variation: {
          numerator: metricsData.total_revenue || 0,
          denominator: metricsData.users || 0,
          label: 'Revenue/Users'
        },
        control: {
          numerator: metricsData.control_total_revenue || 0,
          denominator: metricsData.control_users || 0,
          label: 'Revenue/Users'
        }
      };
      break;
    case 'aov':
      absoluteValues = {
        variation: {
          numerator: metricsData.total_revenue || 0,
          denominator: metricsData.transactions || 0,
          label: 'Revenue/Transactions'
        },
        control: {
          numerator: metricsData.control_total_revenue || 0,
          denominator: metricsData.control_transactions || 0,
          label: 'Revenue/Transactions'
        }
      };
      break;
  }

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
      confidenceData={{
        value: metricsData.confidence || 0,
        level: getConfidenceLevel(metricsData.confidence || 0),
        absoluteValues: absoluteValues
      }}
    />
  )
}

function TableSkeleton({ rows = 3, showSecondaryMetrics = false }) {
  return (
    <div className="space-y-6">
      {/* Filtres skeleton */}
      <div className="flex justify-end gap-2">
        <div className="w-[200px] h-10 bg-muted animate-pulse rounded-md" />
        <div className="w-[200px] h-10 bg-muted animate-pulse rounded-md" />
      </div>

      {/* Tableau principal skeleton */}
      <Card className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 bg-muted/50">
                <div className="w-24 h-4 bg-muted animate-pulse rounded" />
              </TableHead>
              {[...Array(4)].map((_, i) => (
                <TableHead key={i} className="h-12 text-right bg-muted/50">
                  <div className="w-20 h-4 bg-muted animate-pulse rounded ml-auto" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(rows)].map((_, i) => (
              <TableRow key={i} className="h-[72px]">
                <TableCell>
                  <div className="w-32 h-4 bg-muted animate-pulse rounded" />
                </TableCell>
                {[...Array(4)].map((_, j) => (
                  <TableCell key={j} className="text-right">
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-muted animate-pulse rounded ml-auto" />
                      {i > 0 && (
                        <div className="space-y-1">
                          <div className="w-16 h-3 bg-muted animate-pulse rounded ml-auto" />
                          <div className="w-12 h-3 bg-muted animate-pulse rounded ml-auto" />
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

      {/* Tableaux secondaires skeleton */}
      {showSecondaryMetrics && (
        <div className="grid grid-cols-2 gap-4 mt-8">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="h-12 bg-muted/50">
                      <div className="w-24 h-4 bg-muted animate-pulse rounded" />
                    </TableHead>
                    <TableHead className="h-12 text-right bg-muted/50">
                      <div className="w-20 h-4 bg-muted animate-pulse rounded ml-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(rows)].map((_, j) => (
                    <TableRow key={j} className="h-[72px]">
                      <TableCell>
                        <div className="w-32 h-4 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-muted animate-pulse rounded ml-auto" />
                          {j > 0 && (
                            <div className="space-y-1">
                              <div className="w-16 h-3 bg-muted animate-pulse rounded ml-auto" />
                              <div className="w-12 h-3 bg-muted animate-pulse rounded ml-auto" />
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
      )}
    </div>
  )
}

const getConfidenceLevel = (confidence: number): { label: string, color: string } => {
  if (confidence >= 95) {
    return { label: 'Statistically Significant', color: 'text-green-500' }
  }
  if (confidence >= 90) {
    return { label: 'Partially Significant', color: 'text-yellow-500' }
  }
  return { label: 'Not Significant', color: 'text-muted-foreground' }
}

// Fonction utilitaire pour grouper les transactions
const groupTransactionsByID = (transactions: any[]) => {
  // Log pour debug
  console.log("Données avant agrégation:", transactions.slice(0, 2));
  
  return transactions.reduce((acc, transaction) => {
    const id = transaction.transaction_id;
    if (!acc[id]) {
      acc[id] = {
        transaction_id: id,
        variation: transaction.variation,
        device_category: transaction.device_category || transaction.device, // Ajout du fallback
        revenue: 0,
        quantity: 0,
        item_categories: new Set(),
        item_name_simple: new Set(),
      };
    }
    
    // Ajouter les valeurs avec vérification des types
    const revenue = typeof transaction.revenue === 'string' ? 
      parseFloat(transaction.revenue) : transaction.revenue;
    const quantity = typeof transaction.quantity === 'string' ? 
      parseFloat(transaction.quantity) : transaction.quantity;
    
    acc[id].revenue += revenue || 0;
    acc[id].quantity += quantity || 0;
    if (transaction.item_category2) acc[id].item_categories.add(transaction.item_category2);
    if (transaction.item_name_simple) acc[id].item_name_simple.add(transaction.item_name_simple);
    
    return acc;
  }, {});
};

interface Transaction {
  transaction_id: string;
  variation: string;
  device_category: string;
  revenue: number;
  quantity: number;
  item_categories: string;
  item_name_simple: string;
}

export function RevenueAnalysis({ data, isLoading = false }: RevenueAnalysisProps) {
  const [deviceFilter, setDeviceFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>(["all"])
  const [categories, setCategories] = React.useState<string[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true)
  const [revenueData, setRevenueData] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isCalculating, setIsCalculating] = React.useState(true)
  const [showChart, setShowChart] = React.useState(false)

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

  // Ajout d'un état pour les données agrégées
  const [aggregatedTransactions, setAggregatedTransactions] = React.useState<Transaction[]>([])

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

  // Extraire les catégories uniques des données
  React.useEffect(() => {
    if (data?.analysisData?.raw_data?.transaction) {
      const uniqueCategories = Array.from(new Set(
        data.analysisData.raw_data.transaction
          .map((t: any) => t.item_category2)
          .filter(Boolean)
      )).sort()
      setCategories(uniqueCategories)
      setIsLoadingCategories(false)
    }
  }, [data])

  // Modifier la fonction fetchRevenueData
  const fetchRevenueData = async () => {
    try {
      setIsCalculating(true)
      setError(null)
      
      const filteredTransactions = data?.analysisData?.raw_data?.transaction.filter((t: any) => {
        const matchesDevice = deviceFilter === "all" || t.device === deviceFilter;
        
        // Correction de la logique de filtrage des catégories
        const matchesCategory = 
          categoryFilter.includes("all") || 
          categoryFilter.some(selectedCategory => {
            // Vérifier si item_category2 contient la catégorie sélectionnée
            return t.item_category2?.toLowerCase().includes(selectedCategory.toLowerCase());
          });
        
        return matchesDevice && matchesCategory;
      }) || [];

      // Log pour debug
      console.log("Filtres actifs:", {
        categories: categoryFilter,
        device: deviceFilter
      });
      console.log("Exemple de transactions filtrées:", 
        filteredTransactions
          .slice(0, 3)
          .map(t => ({
            categories: t.item_category2,
            matchedFilters: categoryFilter.filter(cat => 
              cat !== "all" && t.item_category2?.toLowerCase().includes(cat.toLowerCase())
            )
          }))
      );

      // Grouper les transactions par ID
      const groupedTransactions = groupTransactionsByID(filteredTransactions);
      
      // Convertir l'objet en tableau et formater les Sets en arrays
      const aggregatedTransactions = Object.values(groupedTransactions).map(t => ({
        ...t,
        item_categories: Array.from(t.item_categories).join(' | '),
        item_name_simple: Array.from(t.item_name_simple).join(' | ')
      })) as Transaction[];

      // Log pour debug
      console.log("Transactions agrégées:", aggregatedTransactions.slice(0, 2));

      setAggregatedTransactions(aggregatedTransactions);

      const requestData = {
        overall: data?.analysisData?.raw_data?.overall || [],
        transaction: aggregatedTransactions
      }
      
      const response = await fetch('http://localhost:8000/calculate-revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || 'Failed to fetch revenue data')
      }

      if (!result.success) {
        throw new Error(result.error || 'Invalid response format')
      }

      setRevenueData(result)

      // Log des données traitées
      console.group('Données utilisées par l\'interface')
      console.log('Données filtrées par catégorie(s):', categoryFilter)
      console.log('Données filtrées par device:', deviceFilter)
      console.log('Exemple de données pour les métriques:', {
        control: result.data[result.control],
        variation: Object.entries(result.data)
          .find(([key]) => key !== result.control)?.[1]
      })
      console.log('Exemple de transactions:', filteredTransactions.slice(0, 3))
      console.groupEnd()

    } catch (error) {
      console.error('Error in fetchRevenueData:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsCalculating(false)
    }
  }

  // Mettre à jour les données quand les filtres changent
  React.useEffect(() => {
    if (data?.analysisData?.raw_data) {
      // Log des 5 premières transactions avec toutes leurs colonnes
      console.table(
        data.analysisData.raw_data.transaction
          .slice(0, 5)
          .map(t => ({
            variation: t.variation,
            device: t.device,
            item_category2: t.item_category2,
            revenue: t.revenue,
            timestamp: t.timestamp,
            // ... autres colonnes
            raw: t // log de l'objet complet pour voir toutes les colonnes
          }))
      )
      
      fetchRevenueData()
    }
  }, [data, deviceFilter, categoryFilter])

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

  // Préparer les données pour le RevenueRangeTable
  const revenueRangeData = React.useMemo(() => {
    if (!revenueData) return {}
    
    const result: { [key: string]: any[] } = {}
    Object.entries(revenueData.data).forEach(([variation, _]) => {
      // Utiliser les transactions filtrées
      const transactions = data?.analysisData?.raw_data?.transaction
        .filter((t: any) => {
          const matchesDevice = deviceFilter === "all" || t.device === deviceFilter
          const matchesCategory = 
            categoryFilter.includes("all") || 
            categoryFilter.includes(t.item_category2)
          return t.variation === variation && matchesDevice && matchesCategory
        })
        .map(t => ({
          revenue: parseFloat(t.revenue)
        }))
      result[variation] = transactions
    })
    return result
  }, [revenueData, data?.analysisData?.raw_data?.transaction, deviceFilter, categoryFilter])

  if (isLoading || isCalculating) {
    return <TableSkeleton rows={3} showSecondaryMetrics={true} />
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
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex justify-end gap-2">
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            if (value === "all") {
              setCategoryFilter(["all"])
            } else {
              const newValue = categoryFilter
                .filter(v => v !== "all")
                .includes(value)
                ? categoryFilter.filter(v => v !== value)
                : [...categoryFilter.filter(v => v !== "all"), value]
              
              setCategoryFilter(newValue.length ? newValue : ["all"])
            }
          }}
          disabled={isLoadingCategories}
        >
          <SelectTrigger className="w-[280px]">
            {isLoadingCategories ? (
              <div className="w-full h-4 bg-muted animate-pulse rounded" />
            ) : (
              <SelectValue>
                {categoryFilter.includes("all") 
                  ? "All Categories" 
                  : `${categoryFilter.length} selected`}
              </SelectValue>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem 
                key={category} 
                value={category}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-4 w-4 border rounded flex items-center justify-center",
                    categoryFilter.includes(category) && "bg-primary border-primary"
                  )}>
                    {categoryFilter.includes(category) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <span>{category}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      {/* Première section : Métriques principales et secondaires */}
      <div className="space-y-8 pb-8 border-b border-border/40">
        {/* Premier tableau */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground/70">Primary Metrics</h3>
          <Card className="rounded-lg border bg-card">
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
        </div>

        {/* Tableaux secondaires */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground/70">Secondary Metrics</h3>
          <div className="grid grid-cols-2 gap-4 relative">
            {secondaryMetrics.map((metric, index) => (
              <Card key={metric.key} className="rounded-lg border bg-card">
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
      </div>

      {/* Revenue Range Distribution */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground/70">Revenue Distribution</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChart(!showChart)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showChart ? (
              <TableIcon className="h-4 w-4" />
            ) : (
              <BarChart2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        {revenueData && (
          <RevenueRangeTable 
            data={revenueRangeData} 
            control={revenueData.control}
            isLoading={isLoading || isCalculating}
            showChart={showChart}
          />
        )}
      </div>

      {/* Tableau récapitulatif */}
      <div className="space-y-2 mt-8 border-t pt-8">
        <h3 className="text-sm font-medium text-muted-foreground/70">Transaction Details</h3>
        <Card className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="h-10 bg-muted/50 w-[15%] sticky left-0 bg-background">Variation</TableHead>
                  <TableHead className="h-10 bg-muted/50 w-[20%]">Transaction ID</TableHead>
                  <TableHead className="h-10 bg-muted/50 w-[35%]">Category</TableHead>
                  <TableHead className="h-10 text-right bg-muted/50 w-[15%]">Quantity</TableHead>
                  <TableHead className="h-10 text-right bg-muted/50 w-[15%]">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueData && aggregatedTransactions
                  .filter(t => t.variation === revenueData.control)
                  .slice(0, 50)
                  .map((transaction) => (
                    <TableRow key={transaction.transaction_id} className="h-14">
                      <TableCell className="font-medium w-[15%] sticky left-0 bg-background">{transaction.variation}</TableCell>
                      <TableCell className="w-[20%]">{transaction.transaction_id}</TableCell>
                      <TableCell className="w-[35%] truncate">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="text-left w-full truncate block">
                              {transaction.item_categories}
                            </TooltipTrigger>
                            <TooltipContent>
                              {transaction.item_categories}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right w-[15%]">{transaction.quantity}</TableCell>
                      <TableCell className="text-right w-[15%]">€{transaction.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                {revenueData && aggregatedTransactions
                  .filter(t => t.variation !== revenueData.control)
                  .slice(0, 50)
                  .map((transaction) => (
                    <TableRow key={transaction.transaction_id} className="h-14">
                      <TableCell className="font-medium w-[15%] sticky left-0 bg-background">{transaction.variation}</TableCell>
                      <TableCell className="w-[20%]">{transaction.transaction_id}</TableCell>
                      <TableCell className="w-[35%] truncate">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="text-left w-full truncate block">
                              {transaction.item_categories}
                            </TooltipTrigger>
                            <TooltipContent>
                              {transaction.item_categories}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right w-[15%]">{transaction.quantity}</TableCell>
                      <TableCell className="text-right w-[15%]">€{transaction.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
} 