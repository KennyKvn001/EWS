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
  { key: "age_at_enrollment", title: "Age", sortable: true },
  { key: "gender", title: "Gender", sortable: true },
  { key: "total_units_approved", title: "Units Approved", sortable: true },
  { key: "total_units_evaluated", title: "Units Evaluated", sortable: true },
  { key: "total_units_enrolled", title: "Units Enrolled", sortable: true },
  { key: "average_grade", title: "Average Grade", sortable: true },
  { key: "previous_qualification_grade", title: "Previous Grade", sortable: true },
  { 
    key: "tuition_fees_up_to_date", 
    title: "Fees Up to Date", 
    sortable: true,
    render: (student) => (
      <Badge className={student.tuition_fees_up_to_date 
        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
        : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      }>
        {student.tuition_fees_up_to_date ? "Yes" : "No"}
      </Badge>
    )
  },
  { 
    key: "scholarship_holder", 
    title: "Scholarship", 
    sortable: true,
    render: (student) => (
      <Badge className={student.scholarship_holder 
        ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800" 
        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
      }>
        {student.scholarship_holder ? "Yes" : "No"}
      </Badge>
    )
  },
  { 
    key: "debtor", 
    title: "Debtor", 
    sortable: true,
    render: (student) => (
      <Badge className={student.debtor 
        ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" 
        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
      }>
        {student.debtor ? "Yes" : "No"}
      </Badge>
    )
  },
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
  { key: "uploaded_by", title: "Uploaded By", searchable: true, sortable: true },
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
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm h-full overflow-hidden overflow-y-auto scrollbar-hide auto-scroll">
      <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] rounded-xl p-4 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <h1 className="text-2xl font-semibold text-white dark:text-gray-100 mb-1">At Risk Students</h1>
        <p className="text-sm text-white dark:text-gray-400">Monitor and track students requiring additional support</p>
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
