import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { FeatureImpact } from "@/types/prediction";

interface FeatureImpactCardProps {
  features: FeatureImpact[];
  summary?: {
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

interface FeatureCardProps {
  feature: FeatureImpact;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const dropoutImpact = feature.dropout_impact;
  const graduateImpact = feature.graduate_impact;
  const impactPercentage = Math.abs(dropoutImpact) * 100;
  const isPositive = dropoutImpact > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={cn(
      "p-2.5 rounded-lg border-2 transition-all hover:shadow-md bg-white dark:bg-gray-900",
      isPositive 
        ? "border-red-200 dark:border-red-800" 
        : "border-green-200 dark:border-green-800"
    )}>
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className={cn(
              "flex items-center justify-center w-6 h-6 rounded-lg font-bold text-[10px] shrink-0",
              isPositive 
                ? "bg-red-500 text-white" 
                : "bg-green-500 text-white"
            )}>
              {index + 1}
            </div>
            <h4 className="font-semibold text-xs text-gray-900 dark:text-white truncate leading-tight">
              {formatFeatureName(feature.feature)}
            </h4>
          </div>
          <div className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0",
            isPositive 
              ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" 
              : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
          )}>
            <Icon className="h-2.5 w-2.5" />
            <span>{isPositive ? '+' : ''}{impactPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Impact Values Grid */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="p-1.5 rounded bg-gray-50 dark:bg-gray-800">
            <div className="text-[9px] text-muted-foreground mb-0.5">Dropout</div>
            <div className={cn(
              "font-mono font-bold text-[10px]",
              isPositive ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
            )}>
              {dropoutImpact > 0 ? '+' : ''}{dropoutImpact.toFixed(4)}
            </div>
          </div>
          <div className="p-1.5 rounded bg-gray-50 dark:bg-gray-800">
            <div className="text-[9px] text-muted-foreground mb-0.5">Graduate</div>
            <div className="font-mono font-bold text-[10px] text-gray-900 dark:text-white">
              {graduateImpact > 0 ? '+' : ''}{graduateImpact.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
          <p className="text-[10px] text-muted-foreground italic leading-tight">
            {feature.interpretation}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FeatureImpactCard({ features, summary }: FeatureImpactCardProps) {
  const [showAll, setShowAll] = useState(false);

  const sortedFeatures = [...features].sort(
    (a, b) => Math.abs(b.dropout_impact) - Math.abs(a.dropout_impact)
  );
  const displayFeatures = showAll ? sortedFeatures : sortedFeatures.slice(0, 4);
  const hasMore = sortedFeatures.length > 4;

  const riskFactors = sortedFeatures.filter(f => f.dropout_impact > 0);
  const protectiveFactors = sortedFeatures.filter(f => f.dropout_impact < 0);

  const totalRiskImpact = riskFactors.reduce((sum, f) => sum + f.dropout_impact, 0) * 100;
  const totalProtectiveImpact = Math.abs(protectiveFactors.reduce((sum, f) => sum + f.dropout_impact, 0)) * 100;

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#2563eb] text-white p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Explainable AI Analysis</h3>
            <p className="text-xs text-white/80">Feature impacts on prediction</p>
          </div>
        </div>
      </div>

      <CardContent className="p-3 space-y-3">
        {/* Integrated Summary - Horizontal Badge Bar */}
        {summary && (
          <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <div className="text-[9px] text-muted-foreground mb-0.5">Most Influential</div>
              <div className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 truncate leading-tight">
                {formatFeatureName(summary.most_influential_feature)}
              </div>
            </div>
            <div className="text-center border-x border-blue-200 dark:border-blue-800 px-1">
              <div className="text-[9px] text-muted-foreground mb-0.5">Strongest Risk</div>
              <div className="text-[10px] font-semibold text-red-700 dark:text-red-300 truncate leading-tight">
                {formatFeatureName(summary.strongest_dropout_factor)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-muted-foreground mb-0.5">Strongest Protective</div>
              <div className="text-[10px] font-semibold text-green-700 dark:text-green-300 truncate leading-tight">
                {formatFeatureName(summary.strongest_protective_factor)}
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats - Compact */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-base font-bold text-blue-600 dark:text-blue-400">
              {sortedFeatures.length}
            </div>
            <div className="text-[9px] font-medium text-muted-foreground">Features</div>
          </div>
          <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400" />
              <div className="text-base font-bold text-red-600 dark:text-red-400">
                {riskFactors.length}
              </div>
            </div>
            <div className="text-[9px] font-medium text-muted-foreground">Risk</div>
            <div className="text-[9px] text-red-600 dark:text-red-400 font-semibold">
              +{totalRiskImpact.toFixed(1)}%
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" />
              <div className="text-base font-bold text-green-600 dark:text-green-400">
                {protectiveFactors.length}
              </div>
            </div>
            <div className="text-[9px] font-medium text-muted-foreground">Protective</div>
            <div className="text-[9px] text-green-600 dark:text-green-400 font-semibold">
              -{totalProtectiveImpact.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Feature Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-2">
          {displayFeatures.map((feature, index) => (
            <FeatureCard
              key={`${feature.feature}-${index}`}
              feature={feature}
              index={index}
            />
          ))}
        </div>

        {/* Show More/Less Button */}
        {hasMore && (
          <div className="flex justify-center pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white text-xs h-7"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show More ({sortedFeatures.length - 5} more)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Impact Balance - Compact */}
        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-gray-900 dark:text-white">Impact Balance</span>
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded",
              totalRiskImpact > totalProtectiveImpact 
                ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" 
                : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
            )}>
              {totalRiskImpact > totalProtectiveImpact ? 'Risk-Dominant' : 'Protection-Dominant'}
            </span>
          </div>
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-500 to-red-600"
              style={{ width: `${(totalRiskImpact / (totalRiskImpact + totalProtectiveImpact)) * 100}%` }}
            />
            <div
              className="bg-gradient-to-r from-green-500 to-green-600"
              style={{ width: `${(totalProtectiveImpact / (totalRiskImpact + totalProtectiveImpact)) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
