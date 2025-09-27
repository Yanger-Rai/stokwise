"use client";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState, useMemo, useEffect } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DateFilterDropdown } from "./date-filter-dropdown";
import { DateRange } from "react-day-picker";
import { isAfter, isBefore, parseISO } from "date-fns";

// 1. Extend the TanStack Table types to include our custom filter function
declare module "@tanstack/react-table" {
  interface FilterFns {
    dateRangeFilter: FilterFn<unknown>;
  }
}

// 2. Define the custom date range filter logic
const dateRangeFilter: FilterFn<unknown> = (row, columnId, value) => {
  const dateString = row.getValue(columnId) as string;
  // Convert the string date from the row data (e.g., "2025-09-18") to a Date object.
  const rowDate = parseISO(dateString);
  const dateRange = value as DateRange;

  if (!dateRange || (!dateRange.from && !dateRange.to)) {
    return true; // No filter applied
  }

  const { from, to } = dateRange;

  const checkFrom = from
    ? isAfter(rowDate, from) || rowDate.getTime() === from.getTime()
    : true;
  const checkTo = to
    ? isBefore(rowDate, to) || rowDate.getTime() === to.getTime()
    : true;

  // The row must be on or after 'from' AND on or before 'to'.
  return checkFrom && checkTo;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [date, setDate] = useState<DateRange | undefined>();

  // 3. Update the columns array to assign the custom filterFn to the "date" accessorKey.
  const processedColumns = useMemo(() => {
    return columns.map((col) => {
      // This assumes 'date' is the accessor key in your data, which it is in your `DailyStockSummary` type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((col as any).accessorKey === "date") {
        return {
          ...col,
          filterFn: "dateRangeFilter" as const,
        };
      }
      return col;
    });
  }, [columns]);

  // 4. Update the columnFilters state whenever a new date range is selected
  useEffect(() => {
    setColumnFilters((prev) => {
      // Remove any previous date filter
      const newFilters = prev.filter((f) => f.id !== "date");

      // Add the new date filter if a valid range is present
      if (date && (date.from || date.to)) {
        newFilters.push({
          id: "date",
          value: date, // The value passed to the filterFn is the DateRange object
        });
      }
      return newFilters;
    });
  }, [date]);

  const table = useReactTable({
    data,
    columns: processedColumns, // Use the columns with the custom filterFn
    // 5. Register the custom filter function with the table
    filterFns: {
      dateRangeFilter: dateRangeFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter by date..."
          value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("date")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div> */}

      <div className="flex py-2 w-full justify-end">
        {/* Your new preset dropdown */}
        <DateFilterDropdown setDate={setDate} />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
