import { AlertCircle, CheckCircle, AlertTriangle, Lightbulb, RotateCcw, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type RiskLevel = "high" | "medium" | "low";

export interface PredictionResult {
  riskLevel: RiskLevel;
  riskScore: number;
}

interface PredictionResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: PredictionResult | null;
  onExplain?: () => void;
  onRerun?: () => void;
  isExplainingLoading?: boolean;
  isRerunLoading?: boolean;
}

const riskConfig = {
  high: {
    label: "High Risk",
    icon: AlertCircle,
    bgGradient: "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30",
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
    bgGradient: "from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-900/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    badgeBg: "bg-orange-500",
    circleColor: "#f97316",
    circleBg: "#ffedd5",
    description: "This student shows some warning signs and should be monitored",
  },
  low: {
    label: "Low Risk",
    icon: CheckCircle,
    bgGradient: "from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    badgeBg: "bg-green-600",
    circleColor: "#16a34a",
    circleBg: "#dcfce7",
    description: "This student is performing well and on track",
  },
};

export default function PredictionResultDialog({
  open,
  onOpenChange,
  result,
  onExplain,
  onRerun,
  isExplainingLoading = false,
  isRerunLoading = false,
}: PredictionResultDialogProps) {
  if (!result) return null;

  const config = riskConfig[result.riskLevel];
  const percentage = Math.round(result.riskScore * 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden" showCloseButton={false}>
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
        <div className="p-6 space-y-6">
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
                      <div className={cn("text-3xl font-bold", config.textColor)}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className={cn("text-2xl font-bold mb-1", config.textColor)}>
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
          {onExplain && (
           <Button
              onClick={onExplain}
              disabled={isExplainingLoading}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm"
              >
              {isExplainingLoading ? (
                <>
                  <span className="animate-spin mr-2"><Loader2 /></span>
                    Loading...
                  </>
                  ) : (
                      <>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        View Explainability
                      </>
                  )}
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

