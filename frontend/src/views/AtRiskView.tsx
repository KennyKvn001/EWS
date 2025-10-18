import { useEffect, useState } from "react";
import type { ColumnDefinition } from "@/components/myui/CustomTable";
import EwsTable from "@/components/myui/EwsTable";
import { useClient } from "@/hooks/useClient";
import type { Student } from "@/types";
import { Badge } from "@/components/ui/badge";

const getRiskBadgeColor = (riskCategory: string) => {
  const category = riskCategory?.toLowerCase();
  if (category === "low") {
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
  } else if (category === "medium") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
  } else if (category === "high") {
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
  }
  return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
};

const studentsColumns: ColumnDefinition<Student>[] = [
  { key: "id", title: "Student ID" },
  { key: "age", title: "Age", sortable: true },
  { key: "marital_status", title: "Marital Status", sortable: true },
  { 
    key: "employed", 
    title: "Employed", 
    sortable: true,
    render: (student) => (
      <Badge className={student.employed 
        ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" 
        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
      }>
        {student.employed ? "Yes" : "No"}
      </Badge>
    )
  },
  { 
    key: "scholarship", 
    title: "Scholarship", 
    sortable: true,
    render: (student) => (
      <Badge className={student.scholarship 
        ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800" 
        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
      }>
        {student.scholarship ? "Yes" : "No"}
      </Badge>
    )
  },
  { key: "attendance_score", title: "Attendance", sortable: true },
  { key: "engagement_score", title: "Engagement", sortable: true },
  { 
    key: "risk_category", 
    title: "Risk Category", 
    sortable: true, 
    searchable: true,
    render: (student) => (
      <Badge className={getRiskBadgeColor(student.risk_category ?? "")}>
        {student.risk_category ?? "Unknown"}
      </Badge>
    )
  },
  { key: "uploaded_by", title: "Uploaded By", searchable: true },
];

interface StudentsResponse {
  students: Student[];
  total: number;
  skip: number;
  limit: number;
}

export default function AtRiskView() {
  const [students, setStudents] = useState<Student[]>([]);
  const { loading, error, fetchClient } = useClient();
  const fetchStudents = async () => {
    try {
      const data = await fetchClient<StudentsResponse>('/students');
      setStudents(data.students);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm h-full">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">At Risk Students</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm h-full">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">At Risk Students</h1>
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm h-full overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">At Risk Students</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monitor and track students requiring additional support</p>
      </div>
      <div className="w-full">
        <EwsTable 
          data={students} 
          columns={studentsColumns} 
          pagination={{ enabled: true, pageSize: 10, showSizeSelector: true }} 
          search={{ enabled: true }}
        />
      </div>
    </div>
  );
}
