import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface TrendData {
  month: string;
  high: number;
  medium: number;
  low: number;
}

interface TrendsChartProps {
  data: TrendData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && Array.isArray(payload) && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          {label}
        </p>
        <div className="space-y-2">
          {payload.map((entry, index: number) => {
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {entry.value}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{total}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload, activeLines, onToggleLine }: {
  payload?: { value: string; color: string; dataKey: string }[];
  activeLines: Record<string, boolean>;
  onToggleLine: (dataKey: string) => void;
}) => {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {payload.map((entry, index) => {
        const isActive = activeLines[entry.dataKey];
        return (
          <button
            key={index}
            onClick={() => onToggleLine(entry.dataKey)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all hover:shadow-md ${
              isActive 
                ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700' 
                : 'bg-gray-100 dark:bg-gray-800/50 opacity-50 hover:opacity-75'
            }`}
          >
            <div 
              className={`w-3 h-3 rounded-full transition-all ${isActive ? 'shadow-sm' : ''}`}
              style={{ backgroundColor: isActive ? entry.color : '#9ca3af' }}
            />
            <span className={`text-xs font-medium ${
              isActive 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-500 dark:text-gray-500'
            }`}>
              {entry.value}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default function TrendsChart({ data }: TrendsChartProps) {
  const [activeLines, setActiveLines] = useState<Record<string, boolean>>({
    high: true,
    medium: true,
    low: true,
  });

  const toggleLine = (dataKey: string) => {
    setActiveLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  // Define legend payload
  const legendPayload = [
    { value: "High Risk", color: "#dc2626", dataKey: "high" },
    { value: "Medium Risk", color: "#f97316", dataKey: "medium" },
    { value: "Low Risk", color: "#16a34a", dataKey: "low" },
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow w-full border-2 border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Risk Trends Over Time
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Monitor risk level patterns across months
            </CardDescription>
          </div>
          <div className="flex-shrink-0">
            <CustomLegend payload={legendPayload} activeLines={activeLines} onToggleLine={toggleLine} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full overflow-x-auto pt-2">
        <div className="min-w-[600px] w-full">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-gray-200 dark:stroke-gray-700"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              />
              <YAxis
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1 }} />
              
              {activeLines.low && (
                <Area
                  type="monotone"
                  dataKey="low"
                  name="Low Risk"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fill="url(#colorLow)"
                  dot={{ fill: "#16a34a", strokeWidth: 2, r: 4, className: "hover:r-6 transition-all" }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: "#16a34a" }}
                  animationDuration={1000}
                />
              )}
              
              {activeLines.medium && (
                <Area
                  type="monotone"
                  dataKey="medium"
                  name="Medium Risk"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#colorMedium)"
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 4, className: "hover:r-6 transition-all" }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: "#f97316" }}
                  animationDuration={1000}
                />
              )}
              
              {activeLines.high && (
                <Area
                  type="monotone"
                  dataKey="high"
                  name="High Risk"
                  stroke="#dc2626"
                  strokeWidth={3}
                  fill="url(#colorHigh)"
                  dot={{ fill: "#dc2626", strokeWidth: 2, r: 4, className: "hover:r-6 transition-all" }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: "#dc2626" }}
                  animationDuration={1000}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

