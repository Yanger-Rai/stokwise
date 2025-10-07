"use client";

import * as React from "react";
import { ChevronsUpDown, Command, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGlobalData } from "@/context/GlobalWrapper";
import Link from "next/link";

export function BusinessSwitcher() {
  const { isMobile } = useSidebar();

  const { businesses, currentBusiness, setCurrentBusiness, isLoading } =
    useGlobalData(); // Get data and action from context

  const activeBusiness = currentBusiness;
  const businessList = businesses || [];

  if (isLoading) {
    // Return a skeleton while the global data is loading
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center w-full p-2 gap-2">
            <div className="bg-muted size-8 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeBusiness) {
    // If there are no businesses for the user, link them to the creation page
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            asChild
            tooltip="Create your first business"
          >
            <a href="/business">
              <Plus className="size-4" />
              <span>Setup Business</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeBusiness.name}
                </span>
                {/* Displaying 'slug' as a subtitle/identifier for now */}
                <span className="truncate text-xs">{activeBusiness.slug}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Your Businesses
            </DropdownMenuLabel>
            {businessList.map((business) => (
              <DropdownMenuItem
                key={business.id}
                onClick={() => setCurrentBusiness(business)} // Use the context action to switch
                className="gap-2 p-2 cursor-pointer"
                disabled={business.id === activeBusiness.id} // Disable if already active
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {/* Using a static icon for now */}
                  <Command className="size-3.5 shrink-0" />
                </div>
                {business.name}
                {business.id === activeBusiness.id && (
                  <DropdownMenuShortcut>Active</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <Link href="/business">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add new business
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
