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
  console.log('Raw overview data:', data);

  const formatValue = (value: number | undefined, type: string) => {
    if (value === undefined || value === null) return '-';
    
    if (type === 'uplift') {
      return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
    }
    if (type === 'rate' || type === 'confidence') {
      return `${value.toFixed(2)}%`;
    }
    if (type === 'revenue') {
      return `€${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const getUpliftColor = (uplift: number) => {
    return uplift > 0 ? 'text-green-500' : 'text-red-500';
  };

  // Fonction pour déterminer si une valeur est la plus élevée pour une métrique donnée
  const isHighestValue = (metric: string, value: number, allValues: any) => {
    const values = Object.values(allValues).map((m: any) => m[metric]?.value || 0);
    return value === Math.max(...values);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!data?.success || !data?.data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    );
  }

  // Inclure le contrôle dans le tableau avec des valeurs par défaut
  const allVariations = {
    [data.control]: {
      users: {
        value: data.data[Object.keys(data.data)[0]]?.users?.control_value ?? 0,
        uplift: 0,
        confidence: 0
      },
      add_to_cart_rate: {
        value: data.data[Object.keys(data.data)[0]]?.add_to_cart_rate?.control_value ?? 0,
        uplift: 0,
        confidence: 0
      },
      transaction_rate: {
        value: data.data[Object.keys(data.data)[0]]?.transaction_rate?.control_value ?? 0,
        uplift: 0,
        confidence: 0
      },
      revenue: {
        value: data.data[Object.keys(data.data)[0]]?.revenue?.control_value ?? 0,
        uplift: 0,
        confidence: 0
      }
    },
    ...data.data
  };

  const metrics = [
    { key: 'users', label: 'Users', type: 'number', showUplift: false, confidenceType: 'normal' },
    { key: 'add_to_cart_rate', label: 'Add to Cart Rate', type: 'rate', showUplift: true, confidenceType: 'normal' },
    { key: 'transaction_rate', label: 'Transaction Rate', type: 'rate', showUplift: true, confidenceType: 'normal' },
    { key: 'revenue', label: 'Revenue', type: 'revenue', showUplift: true, confidenceType: 'revenue' }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-500';
    if (confidence >= 90) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
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
                  index === 0 && "bg-muted/30" // Style spécial pour le contrôle
                )}
              >
                <TableCell className="font-medium align-middle">{variation}</TableCell>
                {metrics.map(metric => (
                  <TableCell key={metric.key} className="text-right align-middle p-0 pr-4">
                    <div className="flex flex-col justify-center min-h-[72px]">
                      <div className={cn(
                        "tabular-nums",
                        isHighestValue(metric.key, metrics_data[metric.key].value, allVariations) && "font-semibold"
                      )}>
                        {formatValue(metrics_data[metric.key].value, metric.type)}
                      </div>
                      {variation !== data.control && metric.showUplift && (
                        <>
                          <div className={cn(
                            "text-sm flex items-center justify-end gap-1",
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
                            "text-xs tabular-nums flex items-center justify-end gap-1",
                            getConfidenceColor(metrics_data[metric.key].confidence)
                          )}>
                            <span>Confiance statistique:</span>
                            {formatValue(metrics_data[metric.key].confidence, 'confidence')}
                          </div>
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