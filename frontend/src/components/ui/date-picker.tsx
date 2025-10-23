import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DateRange {
  from: Date;
  to: Date;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface MonthRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  variant?: "default" | "header";
}

export function MonthRangePicker({ value, onChange, variant = "default" }: MonthRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange>(value);
  const [selectingFrom, setSelectingFrom] = React.useState(true);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const handleMonthSelect = (year: number, month: number) => {
    const selectedDate = new Date(year, month, 1);
    
    if (selectingFrom) {
      setTempRange({ from: selectedDate, to: tempRange.to });
      setSelectingFrom(false);
    } else {
      if (selectedDate < tempRange.from) {
        setTempRange({ from: selectedDate, to: tempRange.from });
      } else {
        setTempRange({ from: tempRange.from, to: selectedDate });
      }
      onChange(tempRange.from <= selectedDate ? { from: tempRange.from, to: selectedDate } : { from: selectedDate, to: tempRange.from });
      setIsOpen(false);
      setSelectingFrom(true);
    }
  };

  const formatDateRange = (range: DateRange) => {
    const fromMonth = months[range.from.getMonth()];
    const fromYear = range.from.getFullYear();
    const toMonth = months[range.to.getMonth()];
    const toYear = range.to.getFullYear();
    
    return `${fromMonth} ${fromYear} - ${toMonth} ${toYear}`;
  };

  const buttonClassName = variant === "header" 
    ? "w-auto min-w-[280px] justify-start text-left font-normal bg-white/20 hover:bg-white/30 text-white border-none hover:text-white shadow-md p-2"
    : "w-auto min-w-[280px] justify-start text-left font-normal bg-white dark:bg-gray-800 hover:bg-white/10 dark:hover:bg-gray-700 border-none p-2";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={buttonClassName}
        >
          <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="whitespace-nowrap">{formatDateRange(value)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-[320px] p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg" align="end">
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <div className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-700">
            {selectingFrom ? "Select start month" : "Select end month"}
          </div>
          {years.map((year) => (
            <div key={year} className="mb-4 last:mb-0">
              <div className="text-xs font-semibold mb-2 text-gray-500 dark:text-gray-400">{year}</div>
              <div className="grid grid-cols-4 gap-2">
                {months.map((month, index) => {
                  const monthDate = new Date(year, index, 1);
                  const isSelected = 
                    (monthDate.getTime() === tempRange.from.getTime()) ||
                    (monthDate.getTime() === tempRange.to.getTime());
                  const isInRange = 
                    monthDate >= tempRange.from && monthDate <= tempRange.to;
                  
                  return (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(year, index)}
                      className={`
                        px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200
                        ${isSelected 
                          ? "bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-white shadow-md scale-105" 
                          : isInRange
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        }
                      `}
                    >
                      {month.substring(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

