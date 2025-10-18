import { useEffect, useState } from "react";
import type { ColumnDefinition } from "@/components/myui/CustomTable";
import EwsTable from "@/components/myui/EwsTable";
import { useClient } from "@/hooks/useClient";
import type { Student } from "@/types";

const studentsColumns: ColumnDefinition<Student>[] = [
  { key: "id", title: "Student ID" },
  { key: "age", title: "Age", sortable: true },
  { key: "marital_status", title: "Marital Status", sortable: true },
  { key: "employed", title: "Employed", sortable: true },
  { key: "scholarship", title: "Scholarship", sortable: true },
  { key: "attendance_score", title: "Attendance", sortable: true },
  { key: "engagement_score", title: "Engagement", sortable: true },
  { key: "risk_category", title: "Risk Category", sortable: true, searchable: true },
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
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm h-full">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">At Risk Students</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm h-full">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">At Risk Students</h1>
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm h-full overflow-auto">
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
