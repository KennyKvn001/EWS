import PredictionForm from "@/components/forms/PredictionForm"
import FileUploadForm from "@/components/forms/FileUploadForm"
import { TabController } from "@/components/myui/TabController"
import type { TabConfig } from "@/types"
import { FileSpreadsheet, FormInput } from "lucide-react"

export default function Prediction() {
  const predictionTabs: TabConfig[] = [
    {
      id: "form",
      label: "Form",
      icon: <FormInput className="w-4 h-4" />,
      content: <PredictionForm />
    },
    {
      id: "upload",
      label: "Upload File",
      icon: <FileSpreadsheet className="w-4 h-4" />,
      content: <FileUploadForm />
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm h-full overflow-hidden overflow-y-auto scrollbar-hide auto-scroll">
      <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] rounded-xl p-4 relative mb-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <h1 className="text-2xl font-semibold text-white dark:text-gray-100 mb-1">Student Risk Prediction</h1>
        <p className="text-sm text-white dark:text-gray-400">
          Enter student information manually or upload a file for batch predictions
        </p>
      </div>
      <TabController tabs={predictionTabs} defaultTab="form" />
    </div>
  )
}
