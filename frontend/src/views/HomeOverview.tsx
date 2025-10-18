import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export default function HomeOverview() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monitor student performance and risk indicators</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Students Card - Featured */}
        <Card className="bg-gradient-to-br from-[#16a085] to-[#0e6f5f] border-none text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-white/80 mb-1">Total Students</CardTitle>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowUpRight className="size-5 text-white" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold mb-3">24</div>
            <div className="flex items-center gap-1.5 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>Increased from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Students */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">At-Risk Students</CardTitle>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowUpRight className="size-4 text-gray-400" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">10</div>
            <div className="flex items-center gap-1 text-xs">
              <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span className="text-orange-600 dark:text-orange-400 font-medium">Need immediate attention</span>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</CardTitle>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowUpRight className="size-4 text-gray-400" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">12</div>
            <div className="flex items-center gap-1 text-xs">
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span className="text-green-600 dark:text-green-400 font-medium">On track students</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reviews</CardTitle>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowUpRight className="size-4 text-gray-400" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">2</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Awaiting assessment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
