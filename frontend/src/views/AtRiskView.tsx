import type { ColumnDefinition } from "@/components/myui/CustomTable";
import EwsTable from "@/components/myui/EwsTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin: string | null;
  salary: number;
}

// Sample data
const sampleUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active", createdAt: "2024-01-15", lastLogin: "2024-03-20", salary: 75000 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", status: "active", createdAt: "2024-02-10", lastLogin: "2024-03-19", salary: 55000 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "editor", status: "inactive", createdAt: "2024-01-05", lastLogin: null, salary: 65000 },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "user", status: "pending", createdAt: "2024-03-01", lastLogin: "2024-03-18", salary: 50000 },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "admin", status: "active", createdAt: "2023-12-20", lastLogin: "2024-03-21", salary: 80000 },
  { id: 6, name: "Diana Davis", email: "diana@example.com", role: "editor", status: "active", createdAt: "2024-02-15", lastLogin: "2024-03-17", salary: 62000 },
  { id: 7, name: "Eve Miller", email: "eve@example.com", role: "user", status: "active", createdAt: "2024-01-30", lastLogin: "2024-03-16", salary: 48000 },
  { id: 8, name: "Frank Anderson", email: "frank@example.com", role: "admin", status: "inactive", createdAt: "2023-11-10", lastLogin: "2024-02-28", salary: 85000 },
  { id: 9, name: "Grace Taylor", email: "grace@example.com", role: "user", status: "active", createdAt: "2024-02-25", lastLogin: "2024-03-15", salary: 52000 },
  { id: 10, name: "Henry Clark", email: "henry@example.com", role: "editor", status: "pending", createdAt: "2024-03-05", lastLogin: null, salary: 58000 },
  { id: 11, name: "Ivy Martinez", email: "ivy@example.com", role: "user", status: "active", createdAt: "2024-01-20", lastLogin: "2024-03-14", salary: 51000 },
  { id: 12, name: "Jack Thompson", email: "jack@example.com", role: "admin", status: "active", createdAt: "2023-10-15", lastLogin: "2024-03-22", salary: 90000 },
];

const sampleUsersColumns: ColumnDefinition<User>[] = [
  { key: "id", title: "ID" },
  { key: "name", title: "Name", sortable: true, searchable: true },
  { key: "email", title: "Email", sortable: true, searchable: true },
  { key: "role", title: "Role", sortable: true },
];

export default function AtRiskView() {
  return (
    <div className="w-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">At Risk Students</h1>
      <EwsTable data={sampleUsers} columns={sampleUsersColumns} pagination={{ enabled: true, pageSize: 10, showSizeSelector: true }} search={{ enabled: true }}/>
    </div>
  )
}
