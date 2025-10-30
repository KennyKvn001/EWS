import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PredictionResultDialog, {
  type PredictionResult,
  type RiskLevel,
} from "./PredictionResultDialog";

/**
 * Example component demonstrating the PredictionResultDialog
 * This is for testing and demonstration purposes
 */
export default function PredictionResultDialogExample() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<PredictionResult | null>(null);

  const exampleResults: Record<RiskLevel, PredictionResult> = {
    high: {
      riskLevel: "high",
      riskScore: 0.87,
    
    },
    medium: {
      riskLevel: "medium",
      riskScore: 0.52,
    },
    low: {
      riskLevel: "low",
      riskScore: 0.18,
    },
  };

  const openDialog = (riskLevel: RiskLevel) => {
    setSelectedResult(exampleResults[riskLevel]);
    setDialogOpen(true);
  };

  const handleExplain = () => {
    console.log("Explaining prediction:", selectedResult);
    alert("Explainability feature activated! This would show SHAP values and feature importance.");
  };

  const handleRerun = () => {
    console.log("Re-running prediction for:", selectedResult);
    setDialogOpen(false);
    setTimeout(() => {
      alert("Prediction re-run! New results would be displayed here.");
    }, 500);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prediction Result Dialog Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click on any button below to see how the prediction result dialog appears for different risk levels.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => openDialog("high")}
              className="bg-red-600 hover:bg-red-700 text-white h-auto py-6 flex-col gap-2"
            >
              <span className="text-lg font-bold">High Risk</span>
              <span className="text-xs opacity-90">87% risk score</span>
            </Button>

            <Button
              onClick={() => openDialog("medium")}
              className="bg-orange-500 hover:bg-orange-600 text-white h-auto py-6 flex-col gap-2"
            >
              <span className="text-lg font-bold">Medium Risk</span>
              <span className="text-xs opacity-90">52% risk score</span>
            </Button>

            <Button
              onClick={() => openDialog("low")}
              className="bg-green-600 hover:bg-green-700 text-white h-auto py-6 flex-col gap-2"
            >
              <span className="text-lg font-bold">Low Risk</span>
              <span className="text-xs opacity-90">18% risk score</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* The Dialog */}
      <PredictionResultDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        result={selectedResult}
        onExplain={handleExplain}
        onRerun={handleRerun}
      />
    </div>
  );
}

