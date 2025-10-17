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
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2 mt-4">
        <h1 className="text-3xl font-bold">Student Risk Prediction</h1>
        <p className="text-muted-foreground">
          Enter student information manually or upload a file for batch predictions
        </p>
      </div>
      <TabController tabs={predictionTabs} defaultTab="form" />
    </div>
  )
}
