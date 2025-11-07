import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, User } from "lucide-react";
import { predictionApi, PredictionApiError } from "@/services/predictionApi";
import type { Student } from "@/types/student";

interface StudentSelectorProps {
  onStudentSelect: (student: Student | null) => void;
  selectedStudentId?: string | null;
  disabled?: boolean;
}

export function StudentSelector({
  onStudentSelect,
  selectedStudentId,
  disabled = false,
}: StudentSelectorProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await predictionApi.fetchAtRiskStudents(0, 100);
      setStudents(response.students);
    } catch (err) {
      if (err instanceof PredictionApiError) {
        setError(err.getUserMessage());
      } else {
        setError("Failed to load at-risk students. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (value: string) => {
    if (value === "clear") {
      onStudentSelect(null);
    } else {
      const student = students.find((s) => s.id === value);
      if (student) {
        onStudentSelect(student);
      }
    }
  };

  const getRiskBadgeVariant = (
    riskCategory?: string
  ): "destructive" | "default" | "secondary" => {
    if (!riskCategory) return "secondary";

    switch (riskCategory.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRiskBadgeColor = (riskCategory?: string): string => {
    if (!riskCategory) return "bg-gray-500";

    switch (riskCategory.toLowerCase()) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <Spinner size="sm" className="mr-2" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Loading at-risk students...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <button
            onClick={fetchStudents}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  if (students.length === 0) {
    return (
      <Alert>
        <User className="h-4 w-4" />
        <AlertDescription>
          No at-risk students available. Students with Medium or High risk
          categories will appear here.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
        Select At-Risk Student
      </label>
      <Select
        value={selectedStudentId || ""}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a student to populate form..." />
        </SelectTrigger>
        <SelectContent>
          {selectedStudentId && (
            <>
              <SelectItem value="clear">
                <span className="text-gray-500 italic">Clear Selection</span>
              </SelectItem>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
            </>
          )}
          {students.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  Student {student.id.slice(0, 8)}
                </span>
                <Badge
                  variant={getRiskBadgeVariant(student.risk_category)}
                  className={`${getRiskBadgeColor(
                    student.risk_category
                  )} text-white border-0`}
                >
                  {student.risk_category?.toUpperCase() || "UNKNOWN"}
                </Badge>
                <span className="text-xs text-gray-500">
                  (Grade: {student.average_grade.toFixed(1)}%, Age:{" "}
                  {student.age_at_enrollment})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
