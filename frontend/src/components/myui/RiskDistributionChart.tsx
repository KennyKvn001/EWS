import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

export interface RiskDistributionData {
  name: string;
  value: number;
  color: string;
}

interface RiskDistributionChartProps {
  data: RiskDistributionData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: RiskDistributionData;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-4 h-4 rounded-full shadow-md" 
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {data.name}
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {data.value}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Students
        </div>
      </div>
    );
  }
  return null;
};

export default function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  
  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("high")) return <AlertCircle className="w-5 h-5" />;
    if (name.toLowerCase().includes("medium")) return <AlertTriangle className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow h-full border-2 border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Risk Distribution
        </CardTitle>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Current student breakdown
        </p>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Donut Chart */}
        <div className="relative mb-4">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={85}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
                animationBegin={0}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="stroke-white dark:stroke-gray-900 hover:opacity-90 transition-all cursor-pointer filter hover:brightness-110"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text showing total */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {total}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
              Total
            </div>
          </div>
        </div>
        
        {/* Legend with stats */}
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg shadow-sm"
                    style={{ 
                      backgroundColor: `${item.color}15`,
                      color: item.color 
                    }}
                  >
                    {getIcon(item.name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    students
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

