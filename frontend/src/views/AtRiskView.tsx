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
      <div className="w-full flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">At Risk Students</h1>
        <div>Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">At Risk Students</h1>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-fit flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">At Risk Students</h1>
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
