
import * as React from "react"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'
import { Input } from '../ui/input'
import { cn } from "@/lib/utils"
import { ChevronUpIcon, ChevronDownIcon, Search, Loader2 } from "lucide-react"

// Column definition interface
export interface ColumnDefinition<T> {
  key: keyof T;                          // Data key to access value
  title: string;                        // Column header title
  sortable?: boolean;                   // Enable sorting for this column
  searchable?: boolean;                 // Include in global search
  width?: string;                       // Column width (e.g., "200px", "20%")
  align?: 'left' | 'center' | 'right';  // Text alignment
  converter?: (value: T[keyof T]) => string;      // Convert raw value before rendering/sorting
  render?: (row: T, index?: number, data?: T[]) => React.ReactNode; // Custom cell renderer
  headerRender?: () => React.ReactNode; // Custom header renderer
  className?: string;                   // Custom cell className
  headerClassName?: string;             // Custom header className
}

// Sort configuration
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Main component props
export interface CustomTableProps<T> {
  // Required props
  data: T[];
  columns: ColumnDefinition<T>[];
  
  // Optional
  className?: string;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    showInfo?: boolean;
    showSizeSelector?: boolean;
    pageSizeOptions?: number[];
  };
  sorting?: {
    enabled: boolean;
    defaultSort?: SortConfig;
  };
  search?: {
    enabled: boolean;
    placeholder?: string;
    debounceMs?: number;
  };
  loading?: boolean;
  emptyMessage?: string;
  
  // Event handlers
  onRowClick?: (row: T, index: number) => void;
  onSort?: (sortConfig: SortConfig) => void;
  onSearch?: (searchTerm: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export default function CustomTable<T>({
  data = [],
  columns,
  className = "",
  pagination = { enabled: true, pageSize: 10, showInfo: true },
  sorting = { enabled: true },
  search = { enabled: false, placeholder: "Search...", debounceMs: 300 },
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  onSort,
  onSearch,
  onPageChange,
  onPageSizeChange,
}: CustomTableProps<T>) {
  
  // Internal state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(pagination.pageSize || 10);
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(
    sorting.defaultSort || null
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      onSearch?.(searchTerm);
    }, search.debounceMs || 300);

    return () => clearTimeout(timer);
  }, [searchTerm, search.debounceMs, onSearch]);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!search.enabled || !debouncedSearchTerm) return data;
    
    return data.filter((row: T) => {
      return columns.some((column) => {
        if (!column.searchable) return false;
        const rawValue = row[column.key];
        const value = column.converter ? column.converter(rawValue) : rawValue;
        return String(value).toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      });
    });
  }, [data, columns, debouncedSearchTerm, search.enabled]);

  // Sort filtered data
  const sortedData = React.useMemo(() => {
    if (!sorting.enabled || !sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.key === sortConfig.key);
      
      const rawAValue = a[sortConfig.key as keyof T];
      const rawBValue = b[sortConfig.key as keyof T];
      
      const aValue = column?.converter ? column.converter(rawAValue) : rawAValue;
      const bValue = column?.converter ? column.converter(rawBValue) : rawBValue;
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortConfig, sorting.enabled, columns]);

  // Paginate sorted data
  const paginatedData = React.useMemo(() => {
    if (!pagination.enabled) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination.enabled]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startItem = Math.min((currentPage - 1) * pageSize + 1, sortedData.length);
  const endItem = Math.min(currentPage * pageSize, sortedData.length);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sorting.enabled) return;
    
    const newSortConfig: SortConfig = {
      key: columnKey,
      direction: sortConfig?.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    };
    
    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
    onPageSizeChange?.(newPageSize);
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination.enabled || totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) handlePageChange(currentPage - 1);
          }}
          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    // Page numbers with ellipsis
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
      }
    }
    
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={page === currentPage}
            onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) handlePageChange(currentPage + 1);
          }}
          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    return items;
  };

  return (
    <div className={cn("w-full space-y-4")}>
      {/* Search and Controls */}
      {(search.enabled || (pagination.enabled && pagination.showSizeSelector)) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
          {/* Search */}
          {search.enabled && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={search.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table className={cn("w-full", className)}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key as string}
                  className={cn(
                    "bg-muted/50 font-medium text-foreground",
                    column.headerClassName,
                    column.sortable && "cursor-pointer select-none hover:bg-muted/70",
                    column.align === 'center' && "text-center",
                    column.align === 'right' && "text-right"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center gap-2">
                    {column.headerRender ? column.headerRender() : column.title}
                    {column.sortable && sorting.enabled && (
                      <div className="flex flex-col">
                        <ChevronUpIcon 
                          className={cn(
                            "h-3 w-3",
                            sortConfig?.key === column.key && sortConfig.direction === 'asc'
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        />
                        <ChevronDownIcon 
                          className={cn(
                            "h-3 w-3",
                            sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((column) => {
                    const rawValue = row[column.key as keyof T];
                    const convertedValue = column.converter ? column.converter(rawValue) : rawValue;
                    return (
                      <TableCell
                        key={column.key as string}
                        className={cn(
                          "border-b border-border px-4 py-3 text-muted-foreground",
                          column.className,
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right"
                        )}
                      >
                        {column.render ? column.render(row) : String(convertedValue || '')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Info and Pagination */}
      {pagination.enabled && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Page Size Selector */}
          {pagination.enabled && pagination.showSizeSelector && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="rounded border border-input bg-background px-3 py-1 text-sm text-foreground cursor-pointer"
              >
                {(pagination.pageSizeOptions || [5, 10, 20, 50]).map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
          )}
          {/* Table Info */}
          {pagination.showInfo && sortedData.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {startItem} to {endItem} of {sortedData.length} entries
              {debouncedSearchTerm && ` (filtered from ${data.length} total entries)`}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {renderPagination()}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
