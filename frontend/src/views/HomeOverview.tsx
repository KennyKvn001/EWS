import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import TrendsChart, { type TrendData } from "@/components/myui/TrendsChart";
import RiskDistributionChart, { type RiskDistributionData } from "@/components/myui/RiskDistributionChart";
import { MonthRangePicker } from "@/components/ui/date-picker";

// TODO: Replace with actual API call to backend endpoint: /api/students/trends?start=YYYY-MM&end=YYYY-MM
// Mock data generator for at-risk student trends
const generateMockTrendData = (): TrendData[] => {
  const data: TrendData[] = [];
  const startDate = new Date(2024, 4, 1); // May 2024
  const monthsToGenerate = 12;

  for (let i = 0; i < monthsToGenerate; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    
    const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    // Generate realistic trending data with some variance
    const baseHigh = 8 + Math.floor(Math.random() * 8);
    const baseMedium = 15 + Math.floor(Math.random() * 15);
    const baseLow = 45 + Math.floor(Math.random() * 25);
    
    data.push({
      month: monthStr,
      high: baseHigh,
      medium: baseMedium,
      low: baseLow,
    });
  }
  
  return data;
};

export default function HomeOverview() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 7, 1), // August 2024
    to: new Date(2025, 3, 1), // April 2025
  });

  // Generate mock data once
  const mockTrendData = useMemo(() => generateMockTrendData(), []);

  // Filter data based on selected date range
  const filteredTrendData = useMemo(() => {
    return mockTrendData.filter((item) => {
      const itemDate = new Date(item.month);
      return itemDate >= dateRange.from && itemDate <= dateRange.to;
    });
  }, [mockTrendData, dateRange]);

  // Mock risk distribution data
  const riskDistributionData: RiskDistributionData[] = [
    { name: "High Risk", value: 10, color: "#dc2626" },
    { name: "Medium Risk", value: 25, color: "#f97316" },
    { name: "Low Risk", value: 65, color: "#16a34a" },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm h-full overflow-hidden overflow-y-auto scrollbar-hide auto-scroll">
      <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] rounded-xl p-4 relative mb-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-white dark:text-gray-100 mb-1">Dashboard</h1>
            <p className="text-sm text-white/90 dark:text-gray-300">Monitor student performance and risk indicators</p>
          </div>
          <div className="relative z-10 mr-10 mt-3">
            <MonthRangePicker value={dateRange} onChange={setDateRange} variant="header" />
          </div>
        </div>
      </div>
      
      {/* TODO: When connected to backend, pass dateRange to API calls to filter card statistics */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Students Card - Featured */}
        <Card className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] border-none text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-white/80">Total Predictions</CardTitle>
            </div>
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowUpRight className="size-4 text-white" />
            </button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-4xl font-bold mb-2">100</div>
            <div className="flex items-center gap-1.5 text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>Increased from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Students */}
        <Card className="shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">At-Risk Students</CardTitle>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowUpRight className="size-4 text-gray-400" />
            </button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">10</div>
            <div className="flex items-center gap-1 text-xs">
              <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span className="text-orange-600 dark:text-orange-400 font-medium">Need immediate attention</span>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</CardTitle>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowUpRight className="size-4 text-gray-400" />
            </button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">12</div>
            <div className="flex items-center gap-1 text-xs">
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span className="text-green-600 dark:text-green-400 font-medium">On track students</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - 2/3 and 1/3 Layout */}
      <div className="mt-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trends Chart - Takes 2/3 of space */}
          <div className="lg:col-span-2">
            <TrendsChart data={filteredTrendData} />
          </div>
          
          {/* Risk Distribution Chart - Takes 1/3 of space */}
          <div className="lg:col-span-1">
            <RiskDistributionChart data={riskDistributionData} />
          </div>
        </div>
      </div>
    </div>
  )
}
