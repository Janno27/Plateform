import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface ConfidenceTooltipProps {
  title: string
  description: string
  methodUsed?: string
  confidenceInterval?: {
    lower: number
    upper: number
    metric: string
  }
}

export function ConfidenceTooltip({ 
  title, 
  description, 
  methodUsed,
  confidenceInterval 
}: ConfidenceTooltipProps) {
  return (
    <div className="w-[380px] text-left">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2 pb-3 border-b border-border">
          <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">Statistical Test</h4>
            <p className="text-sm text-muted-foreground">{title}</p>
            {confidenceInterval && (
              <p className="text-sm text-muted-foreground">
                Confidence Interval ({confidenceInterval.metric}): 
                <span className="font-medium ml-1">
                  [{confidenceInterval.lower.toFixed(2)}%, {confidenceInterval.upper.toFixed(2)}%]
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <span className="font-medium text-foreground block">Method Used</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {methodUsed || description}
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-medium text-foreground block">Confidence Levels</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
                <div className="flex gap-1.5">
                  <span className="text-foreground">≥ 95%</span>
                  <span className="text-muted-foreground">: Statistically Significant</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 shrink-0" />
                <div className="flex gap-1.5">
                  <span className="text-foreground">≥ 90%</span>
                  <span className="text-muted-foreground">: Partially Significant</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-muted shrink-0" />
                <div className="flex gap-1.5">
                  <span className="text-foreground">{"< 90%"}</span>
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