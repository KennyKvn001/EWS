import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Shield } from "lucide-react";

interface XAISummaryProps {
  summary: {
    most_influential_feature: string;
    strongest_dropout_factor: string;
    strongest_protective_factor: string;
  };
}

function formatFeatureName(feature: string): string {
  return feature
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\s*\(scaled\)/gi, "");
}

export default function XAISummary({ summary }: XAISummaryProps) {
  return (
    <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Most Influential Factor */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Most Influential Factor
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                {formatFeatureName(summary.most_influential_feature)}
              </div>
            </div>
          </div>
        </div>

        {/* Strongest Risk Factor */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border border-red-200 dark:border-red-800 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 shrink-0">
              <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                Strongest Risk Factor
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 font-medium">
                {formatFeatureName(summary.strongest_dropout_factor)}
              </div>
            </div>
          </div>
        </div>

        {/* Strongest Protective Factor */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 shrink-0">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                Strongest Protective Factor
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                {formatFeatureName(summary.strongest_protective_factor)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

