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
    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm h-full overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Student Risk Prediction</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter student information manually or upload a file for batch predictions
        </p>
      </div>
      <TabController tabs={predictionTabs} defaultTab="form" />
    </div>
  )
}
