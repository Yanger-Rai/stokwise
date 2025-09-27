import React from "react";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

// This type defines the shape for a daily summary record.
export type DailyStockSummary = {
  date: string; // The specific day for the summary (e.g., "2025-09-18")
  totalOpeningStock: number; // Sum of opening stock for all products on this day
  totalReceived: number; // Sum of all units received
  totalSold: number; // Sum of all units sold
  totalBalance: number; // Sum of the final balance for all products
  netChange: number; // The net change in stock (Received - Sold)
};

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/dataTable/data-table-column-header";

export const columns: ColumnDef<DailyStockSummary>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ), // Format the date for better readability
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <div className="font-medium">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "totalOpeningStock",
    header: "Opening",
  },
  {
    accessorKey: "totalReceived",
    header: "Received",
  },
  {
    accessorKey: "totalSold",
    header: "Sold",
  },
  {
    accessorKey: "netChange",
    header: "Net Change",
    // Use icons and colors to show the daily trend
    cell: ({ row }) => {
      const netChange = row.original.netChange;
      if (netChange > 0) {
        return (
          <Badge
            variant={"outline"}
            className="border-green-600 text-green-600 bg-green-100"
          >
            <ArrowUp />
            {Math.abs(netChange)}
          </Badge>
        );
      }
      if (netChange < 0) {
        return (
          <Badge
            variant="outline"
            className="border-red-600 text-red-600 bg-red-100"
          >
            <ArrowDown />
            {Math.abs(netChange)}
          </Badge>
        );
      }
      return (
        <Badge variant={"outline"} className="text-muted-foreground bg-accent">
          <Minus />
          {netChange}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalBalance",
    header: "Closing Stock",
    cell: ({ row }) => (
      <div className="font-bold">{row.original.totalBalance}</div>
    ),
  },
];
