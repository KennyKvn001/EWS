import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "./PredictionResultDialog";

interface RiskCircleProps {
  riskLevel: RiskLevel;
  riskScore: number;
}

const riskConfig = {
  high: {
    label: "High Risk",
    icon: AlertCircle,
    circleColor: "#dc2626",
    circleBg: "#fee2e2",
    textColor: "text-red-700 dark:text-red-400",
    bgGradient: "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30",
    borderColor: "border-red-200 dark:border-red-800",
    description: "This student requires immediate attention and intervention",
  },
  medium: {
    label: "Medium Risk",
    icon: AlertTriangle,
    circleColor: "#f97316",
    circleBg: "#ffedd5",
    textColor: "text-orange-700 dark:text-orange-400",
    bgGradient: "from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-900/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    description: "This student shows some warning signs and should be monitored",
  },
  low: {
    label: "Low Risk",
    icon: CheckCircle,
    circleColor: "#16a34a",
    circleBg: "#dcfce7",
    textColor: "text-green-700 dark:text-green-400",
    bgGradient: "from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30",
    borderColor: "border-green-200 dark:border-green-800",
    description: "This student is performing well and on track",
  },
};

export default function RiskCircle({ riskLevel, riskScore }: RiskCircleProps) {
  const config = riskConfig[riskLevel];
  const Icon = config.icon;
  const percentage = Math.round(riskScore * 100);
  const radius = 180;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const svgSize = 400;
  const center = svgSize / 2;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Large Circular Progress */}
      <div className="relative shrink-0" style={{ width: svgSize, height: svgSize }}>
        <svg className="transform -rotate-90" style={{ width: svgSize, height: svgSize }}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={config.circleBg}
            strokeWidth="20"
            fill="none"
            className="opacity-30"
          />
          {/* Clean ring - no ticks */}
          {/* Progress circle (flat solid color) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={config.circleColor}
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-6">
            <div
              className={cn(
                "flex items-center justify-center w-24 h-24 rounded-full",
                config.bgGradient,
                config.borderColor,
                "border-4"
              )}
            >
              <Icon className={cn("w-16 h-16", config.textColor)} />
            </div>
          </div>
          <div className="text-center">
            <div className={cn("text-7xl font-bold mb-2", config.textColor)}>
              {percentage}%
            </div>
            <div className="text-base text-muted-foreground font-semibold">
              Risk Score
            </div>
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className={cn("px-8 py-4 rounded-full", config.bgGradient, config.borderColor, "border-2")}>
        <h3 className={cn("text-3xl font-bold text-center", config.textColor)}>
          {config.label}
        </h3>
      </div>

      {/* Description */}
      <p className="text-base text-center text-muted-foreground max-w-sm">
        {config.description}
      </p>

      {/* Probability breakdown (compact) */}
      <div className="w-full max-w-md space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-red-600 dark:text-red-400">Dropout</span>
          <span className="text-muted-foreground">{percentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-red-600 dark:bg-red-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-[10px] text-muted-foreground text-right">
          Probability: {riskScore.toFixed(2)}
        </div>

        <div className="flex items-center justify-between text-xs font-medium mt-2">
          <span className="text-blue-600 dark:text-blue-400">Graduate</span>
          <span className="text-muted-foreground">{100 - percentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500"
            style={{ width: `${100 - percentage}%` }}
          />
        </div>
        <div className="text-[10px] text-muted-foreground text-right">
          Probability: {(1 - riskScore).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

