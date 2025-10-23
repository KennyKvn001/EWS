import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }}></div>
            <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendsChart({ data }: TrendsChartProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          At-Risk Student Trends
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track high, medium, and low risk student trends over time
        </p>
      </CardHeader>
      <CardContent className="w-full overflow-x-auto">
        <div className="min-w-[600px] w-full">
          <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "currentColor" }}
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              tick={{ fill: "currentColor" }}
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: "12px" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="high"
              name="High Risk"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="medium"
              name="Medium Risk"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="low"
              name="Low Risk"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

