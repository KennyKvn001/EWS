import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { FeatureImpact } from "@/types/prediction";

export type RiskLevel = "high" | "medium" | "low";

export interface PredictionResult {
  riskLevel: RiskLevel;
  riskScore: number;
  predictionLabel?: string;
  explanation?: {
    topFeatures: FeatureImpact[];
    summary: {
      most_influential_feature: string;
      strongest_dropout_factor: string;
      strongest_protective_factor: string;
    };
  };
}

interface PredictionResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: PredictionResult | null;
  onExplain?: () => void;
  onRerun?: () => void;
  isExplainingLoading?: boolean;
  isRerunLoading?: boolean;
  showExplanationByDefault?: boolean;
}

const riskConfig = {
  high: {
    label: "High Risk",
    icon: AlertCircle,
    bgGradient:
      "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    badgeBg: "bg-red-600",
    circleColor: "#dc2626",
    circleBg: "#fee2e2",
    description: "This student requires immediate attention and intervention",
  },
  medium: {
    label: "Medium Risk",
    icon: AlertTriangle,
    bgGradient:
      "from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-900/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    badgeBg: "bg-orange-500",
    circleColor: "#f97316",
    circleBg: "#ffedd5",
    description:
      "This student shows some warning signs and should be monitored",
  },
  low: {
    label: "Low Risk",
    icon: CheckCircle,
    bgGradient:
      "from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    badgeBg: "bg-green-600",
    circleColor: "#16a34a",
    circleBg: "#dcfce7",
    description: "This student is performing well and on track",
  },
};

function formatFeatureName(feature: string): string {
  return feature
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getImpactIndicator(impact: number) {
  if (impact > 0) {
    return {
      icon: TrendingUp,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      label: "Increases Risk",
    };
  } else if (impact < 0) {
    return {
      icon: TrendingDown,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      label: "Decreases Risk",
    };
  } else {
    return {
      icon: Minus,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-950/30",
      label: "Neutral",
    };
  }
}

function FeatureImpactItem({ feature }: { feature: FeatureImpact }) {
  const indicator = getImpactIndicator(feature.dropout_impact);
  const Icon = indicator.icon;
  const impactMagnitude = Math.abs(feature.dropout_impact);
  const impactPercentage = Math.min(impactMagnitude * 100, 100);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-3 flex-1">
        <div className={cn("p-2 rounded-full", indicator.bgColor)}>
          <Icon className={cn("h-4 w-4", indicator.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">
            {formatFeatureName(feature.feature)}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {feature.interpretation}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn("text-xs", indicator.color)}>
          {impactPercentage.toFixed(1)}%
        </Badge>
      </div>
    </div>
  );
}

function ExplainabilitySummary({
  summary,
  isExpanded,
  onToggle,
}: {
  summary: {
    most_influential_feature: string;
    strongest_dropout_factor: string;
    strongest_protective_factor: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            Key Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-purple-600 hover:text-purple-700"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 space-y-3">
          <div className="grid gap-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Most Influential Factor
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {formatFeatureName(summary.most_influential_feature)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <div className="text-sm font-medium text-red-900 dark:text-red-100">
                Strongest Risk Factor
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                {formatFeatureName(summary.strongest_dropout_factor)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <div className="text-sm font-medium text-green-900 dark:text-green-100">
                Strongest Protective Factor
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                {formatFeatureName(summary.strongest_protective_factor)}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function PredictionResultDialog({
  open,
  onOpenChange,
  result,
  onExplain,
  onRerun,
  isExplainingLoading = false,
  isRerunLoading = false,
  showExplanationByDefault = true,
}: PredictionResultDialogProps) {
  const [showExplanation, setShowExplanation] = useState(
    showExplanationByDefault
  );
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  if (!result) return null;

  const config = riskConfig[result.riskLevel];
  const percentage = Math.round(result.riskScore * 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const hasExplanation =
    result.explanation && result.explanation.topFeatures.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative flex items-start justify-between">
            <DialogHeader className="flex-1 text-left">
              <DialogTitle className="text-2xl font-bold text-white mb-1">
                Prediction Result
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm">
                Risk assessment completed successfully
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Risk Level Card */}
          <Card
            className={cn(
              "border-2 shadow-md overflow-hidden",
              config.borderColor,
              config.bgGradient
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Circular Progress */}
                <div className="relative shrink-0">
                  <svg className="w-32 h-32 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="45"
                      stroke={config.circleBg}
                      strokeWidth="10"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="45"
                      stroke={config.circleColor}
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={cn("text-3xl font-bold", config.textColor)}
                      >
                        {percentage}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3
                      className={cn(
                        "text-2xl font-bold mb-1",
                        config.textColor
                      )}
                    >
                      {config.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {config.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Explainability Section */}
          {hasExplanation && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  Prediction Explanation
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {showExplanation ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show Details
                    </>
                  )}
                </Button>
              </div>

              {showExplanation && (
                <div className="space-y-4">
                  {/* Summary Section */}
                  {result.explanation && result.explanation.summary && (
                    <ExplainabilitySummary
                      summary={result.explanation.summary}
                      isExpanded={summaryExpanded}
                      onToggle={() => setSummaryExpanded(!summaryExpanded)}
                    />
                  )}

                  {/* Feature Impacts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Feature Impact Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.explanation &&
                        result.explanation.topFeatures.map((feature, index) => (
                          <FeatureImpactItem
                            key={`${feature.feature}-${index}`}
                            feature={feature}
                          />
                        ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Loading state for explanation */}
          {isExplainingLoading && (
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                  <span className="text-sm text-muted-foreground">
                    Loading explanation...
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback button for manual explanation trigger */}
          {!hasExplanation && !isExplainingLoading && onExplain && (
            <Button
              onClick={onExplain}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              View Explainability
            </Button>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-6 pt-0 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 dark:border-gray-600"
          >
            Close
          </Button>
          {onRerun && (
            <Button
              onClick={onRerun}
              disabled={isRerunLoading}
              className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all"
            >
              {isRerunLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Running...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Re-run Prediction
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
