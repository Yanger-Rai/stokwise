// date-filter-dropdown.tsx

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  startOfToday,
  startOfYesterday,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import type { DateRange } from "react-day-picker";

interface DateFilterDropdownProps {
  setDate: (date: DateRange | undefined) => void;
}

export function DateFilterDropdown({ setDate }: DateFilterDropdownProps) {
  const setDateRange = (days: number) => {
    const from = subDays(startOfToday(), days - 1);
    const to = startOfToday();
    setDate({ from, to });
  };

  const setThisMonth = () => {
    const from = startOfMonth(new Date());
    const to = endOfMonth(new Date());
    setDate({ from, to });
  };

  const setLastMonth = () => {
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    setDate({ from: lastMonthStart, to: lastMonthEnd });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarIcon />
          <span>Filter by Date</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => setDateRange(1)}>
          Today
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            setDate({ from: startOfYesterday(), to: startOfYesterday() })
          }
        >
          Yesterday
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDateRange(7)}>
          Last 7 Days
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDateRange(30)}>
          Last 30 Days
        </DropdownMenuItem>
        <DropdownMenuItem onClick={setThisMonth}>This Month</DropdownMenuItem>
        <DropdownMenuItem onClick={setLastMonth}>Last Month</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
