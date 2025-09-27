"use client";
import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { List, LayoutGrid } from "lucide-react";
import { initialNavData } from "@/mock/initialNavData";
import ManageStores from "@/modules/products/ui/manage-stores";

import StoreCard from "@/modules/stores/ui/store-card";
import { StoreData } from "@/types/stores.type";

// --- MAIN PAGE COMPONENT ---

const mockStoreData: StoreData[] = [
  {
    id: "s1",
    name: "Downtown Flagship",
    location: "123 Main St, New York",
    totalItems: 850,
  },
  {
    id: "s2",
    name: "West Side Depot",
    location: "456 Side Rd, Los Angeles",
    totalItems: 1200,
  },
  {
    id: "s3",
    name: "Online Warehouse",
    location: "Remote/Digital",
    totalItems: 5000,
  },
];

export default function Stores() {
  const [view, setView] = useState("grid");

  const [navConfig, setNavConfig] = useState(initialNavData);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ManageStores navConfig={navConfig} setNavConfig={setNavConfig} />
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Input placeholder="Search products..." className="max-w-sm" />
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => {
            if (value) setView(value);
          }}
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Main Content */}
      <div>
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockStoreData.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div>Table</div>
        )}
      </div>
    </div>
  );
}
