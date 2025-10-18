import { cn } from "@/lib/utils";
import CustomTable, { type CustomTableProps } from "./CustomTable";

export default function EwsTable<T>(props: Readonly<CustomTableProps<T>>) {
    const { className = "", ...rest } = props;
  return (
    <div className={cn("w-full overflow-hidden rounded-lg")}>
        <CustomTable 
          className={cn(
            "w-full",
            "[&_thead]:bg-gray-50 dark:[&_thead]:bg-gray-800/50",
            "[&_th]:border-b [&_th]:border-gray-200 dark:[&_th]:border-gray-700 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-medium [&_th]:text-xs [&_th]:text-gray-600 dark:[&_th]:text-gray-400",
            "[&_td]:border-b [&_td]:border-gray-100 dark:[&_td]:border-gray-800 [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-gray-900 dark:[&_td]:text-gray-100",
            "[&_tr:last-child_td]:border-b-0",
            "[&_tbody_tr]:hover:bg-gray-50 dark:[&_tbody_tr]:hover:bg-gray-800/30 [&_tbody_tr]:transition-colors",
            className
          )} 
          {...rest}
        />
    </div>
  )
}
