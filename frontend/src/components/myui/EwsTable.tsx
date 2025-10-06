import { cn } from "@/lib/utils";
import CustomTable, { type CustomTableProps } from "./CustomTable";

export default function EwsTable<T>(props: Readonly<CustomTableProps<T>>) {
    const { className = "", ...rest } = props;
  return (
    <div className={cn("w-full")}>
        <CustomTable 
          className={cn(
            "w-full",
            "[&_thead]:bg-muted/50",
            "[&_th]:border-b [&_th]:border-border [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-medium [&_th]:text-foreground",
            "[&_td]:border-b [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:text-muted-foreground",
            "[&_tr:last-child_td]:border-b-0",
            "[&_tbody_tr]:hover:bg-muted/30 [&_tbody_tr]:transition-colors",
            "[&_tbody_tr:hover_td]:text-foreground",
            className
          )} 
          {...rest}
        />
    </div>
  )
}
