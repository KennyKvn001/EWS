import { RotateCcw, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FeatureImpact } from "@/types/prediction";
import RiskCircle from "./RiskCircle";
import FeatureImpactChart from "./FeatureImpactCard";

export type RiskLevel = "high" | "medium" | "low";

export interface PredictionResult {
  riskLevel: RiskLevel;
  riskScore: number;
  predictionLabel?: string;
  explanation?: {
    topFeatures: FeatureImpact[];
    summary?: {
      most_influential_feature: string;
      strongest_dropout_factor: string;
      strongest_protective_factor: string;
    };
    error?: string;
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
}

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

  const hasExplanation =
    result.explanation && result.explanation.topFeatures.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[95vw] lg:max-w-[1200px] max-h-[95vh] p-0 flex flex-col rounded-lg"
        showCloseButton={false}
      >
        {/* Header with gradient background - Fixed */}
        <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] p-4 relative overflow-hidden shrink-0 rounded-t-lg">
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
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Risk Circle */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shrink-0">
              <RiskCircle
                riskLevel={result.riskLevel}
                riskScore={result.riskScore}
              />
            </div>

            {/* Right Side - XAI Explanation */}
            <div className="flex flex-col min-w-0">
              {hasExplanation ? (
                <>
                  {/* Feature Impact Chart with integrated summary */}
                  {result.explanation && (
                    <FeatureImpactChart
                      features={result.explanation.topFeatures}
                      summary={result.explanation.summary}
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                  {isExplainingLoading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
                      <span className="text-sm text-muted-foreground">
                        Loading explanation...
                      </span>
                    </>
                  ) : onExplain ? (
                    <Button
                      onClick={onExplain}
                      className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all"
                    >
                      Generate Explanation
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      No explanation data available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <DialogFooter className="px-6 py-4 gap-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 dark:border-gray-600 cursor-pointer"
          >
            Close
          </Button>
          {onRerun && (
            <Button
              onClick={onRerun}
              disabled={isRerunLoading}
              className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {isRerunLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
