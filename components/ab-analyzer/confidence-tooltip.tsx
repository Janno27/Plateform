import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface ConfidenceTooltipProps {
  title: string
  description: string
  methodUsed?: string
  showCalculationDetails?: boolean
  confidenceInterval?: {
    lower: number
    upper: number
    metric: string
  }
  confidenceData?: {
    value: number
    level: {
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
}

export function ConfidenceTooltip({ 
  title, 
  description, 
  methodUsed,
  showCalculationDetails = false,
  confidenceInterval,
  confidenceData 
}: ConfidenceTooltipProps) {
  return (
    <div className="w-[380px] text-left">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2 pb-3 border-b border-border">
          <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">Statistical Test</h4>
            <p className="text-xs text-muted-foreground">{title}</p>
            {confidenceInterval && (
              <p className="text-xs text-muted-foreground/80 flex items-baseline gap-1">
                <span className="shrink-0 text-muted-foreground">Confidence Interval ({confidenceInterval.metric}):</span>
                <span className="font-medium text-muted-foreground/60">
                  [{confidenceInterval.lower.toFixed(2)}%, {confidenceInterval.upper.toFixed(2)}%]
                </span>
              </p>
            )}
            {confidenceData && (
              <p className="text-xs flex items-baseline gap-1">
                <span className="shrink-0 text-muted-foreground">Statistical Confidence:</span>
                <span className={cn(
                  "font-medium",
                  confidenceData.level.color
                )}>
                  {confidenceData.value.toFixed(1)}%
                </span>
                <span className="text-muted-foreground/60">
                  - {confidenceData.level.label}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <span className="font-medium text-foreground block text-sm">Method Used</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {methodUsed || description}
            </p>
          </div>

          {showCalculationDetails && confidenceData?.details && (
            <div className="space-y-2 bg-muted/50 p-3 rounded-md">
              <span className="text-xs text-muted-foreground font-medium">Calculation Details</span>
              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1.5">
                  <span className="text-muted-foreground font-medium">Control</span>
                  <div className="space-y-1 bg-background/50 p-2 rounded-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Count:</span>
                      <span className="font-medium text-muted-foreground/80">
                        {confidenceData.details.control.count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium text-muted-foreground/80">
                        {confidenceData.details.control.total}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-1 mt-1">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-medium text-primary/90">
                        {confidenceData.details.control.rate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-muted-foreground font-medium">Variation</span>
                  <div className="space-y-1 bg-background/50 p-2 rounded-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Count:</span>
                      <span className="font-medium text-muted-foreground/80">
                        {confidenceData.details.variation.count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium text-muted-foreground/80">
                        {confidenceData.details.variation.total}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-1 mt-1">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-medium text-primary/90">
                        {confidenceData.details.variation.rate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <span className="font-medium text-foreground block text-sm">Confidence Levels</span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
                <div className="flex gap-1.5">
                  <span className="text-foreground shrink-0">≥ 95%</span>
                  <span className="text-muted-foreground">: Statistically Significant</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 shrink-0" />
                <div className="flex gap-1.5">
                  <span className="text-foreground shrink-0">≥ 90%</span>
                  <span className="text-muted-foreground">: Partially Significant</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-muted shrink-0" />
                <div className="flex gap-1.5">
                  <span className="text-foreground shrink-0">{"< 90%"}</span>
                  <span className="text-muted-foreground">: Not Significant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 