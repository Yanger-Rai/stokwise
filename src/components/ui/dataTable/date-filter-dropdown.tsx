// date-filter-dropdown.tsx

import React, { useState } from "react"; // <-- Import useState
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import CalendarIcon and CheckIcon
import { Calendar as CalendarIcon, Check as CheckIcon } from "lucide-react";
import {
  startOfToday,
  startOfYesterday,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import type { DateRange } from "react-day-picker";

// Define a type for the preset keys/labels
type FilterPresetKey =
  | "All Time"
  | "Today"
  | "Yesterday"
  | "Last 7 Days"
  | "Last 30 Days"
  | "This Month"
  | "Last Month";

interface DateFilterDropdownProps {
  setDate: (date: DateRange | undefined) => void;
}

export function DateFilterDropdown({ setDate }: DateFilterDropdownProps) {
  // Initialize state to track the currently selected preset
  const [selectedPreset, setSelectedPreset] =
    useState<FilterPresetKey>("All Time");

  const handleSelect = (
    key: FilterPresetKey,
    dateRange: DateRange | undefined
  ) => {
    setSelectedPreset(key);
    setDate(dateRange);
  };

  const setDateRange = (days: number, key: FilterPresetKey) => {
    const from = subDays(startOfToday(), days - 1);
    const to = startOfToday();
    handleSelect(key, { from, to });
  };

  const setThisMonth = (key: FilterPresetKey) => {
    const from = startOfMonth(new Date());
    const to = endOfMonth(new Date());
    handleSelect(key, { from, to });
  };

  const setLastMonth = (key: FilterPresetKey) => {
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    handleSelect(key, { from: lastMonthStart, to: lastMonthEnd });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarIcon />
          {/* Display the currently selected preset in the button text */}
          <span>{selectedPreset}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* All Time (No filter) */}
        <DropdownMenuItem
          onClick={() => handleSelect("All Time", undefined)}
          className="justify-between" // Align text left, icon right
        >
          All Time
          {selectedPreset === "All Time" && (
            <CheckIcon className="size-4 ml-2" />
          )}
        </DropdownMenuItem>

        {/* Today */}
        <DropdownMenuItem
          onClick={() => setDateRange(1, "Today")}
          className="justify-between"
        >
          Today
          {selectedPreset === "Today" && <CheckIcon className="size-4 ml-2" />}
        </DropdownMenuItem>

        {/* Yesterday */}
        <DropdownMenuItem
          onClick={() =>
            handleSelect("Yesterday", {
              from: startOfYesterday(),
              to: startOfYesterday(),
            })
          }
          className="justify-between"
        >
          Yesterday
          {selectedPreset === "Yesterday" && (
            <CheckIcon className="size-4 ml-2" />
          )}
        </DropdownMenuItem>

        {/* Last 7 Days */}
        <DropdownMenuItem
          onClick={() => setDateRange(7, "Last 7 Days")}
          className="justify-between"
        >
          Last 7 Days
          {selectedPreset === "Last 7 Days" && (
            <CheckIcon className="size-4 ml-2" />
          )}
        </DropdownMenuItem>

        {/* Last 30 Days */}
        <DropdownMenuItem
          onClick={() => setDateRange(30, "Last 30 Days")}
          className="justify-between"
        >
          Last 30 Days
          {selectedPreset === "Last 30 Days" && (
            <CheckIcon className="size-4 ml-2" />
          )}
        </DropdownMenuItem>

        {/* This Month */}
        <DropdownMenuItem
          onClick={() => setThisMonth("This Month")}
          className="justify-between"
        >
          This Month
          {selectedPreset === "This Month" && (
            <CheckIcon className="size-4 ml-2" />
          )}
        </DropdownMenuItem>

        {/* Last Month */}
        <DropdownMenuItem
          onClick={() => setLastMonth("Last Month")}
          className="justify-between"
        >
          Last Month
          {selectedPreset === "Last Month" && (
            <CheckIcon className="size-4 ml-2" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
