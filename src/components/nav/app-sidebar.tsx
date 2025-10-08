"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { BusinessSwitcher } from "./business-switcher";
import { BusinessState, useBusinessStore } from "@/store/useBusinessStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // --- Use selector functions to get only needed slices of state ---
  const dynamicNav = useBusinessStore((state) => state.dynamicNav);
  const currentUser = useBusinessStore((state) => state.currentUser);
  const isLoading = useBusinessStore((state: BusinessState) => state.isLoading);

  // Fallback check: If data is still loading or the user object is null,
  // don't render the main content. The GlobalWrapper handles the full loading skeleton,
  // but we must protect against a null user for the NavUser component.
  if (isLoading || !currentUser) {
    // Return an empty sidebar structure if possible, or defer to the parent loading state.
    // Given the page level security, if we reach here and it's not loading, there's an issue,
    // but returning null is safe and fast.
    return null;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <BusinessSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dynamicNav} />
        {/* <NavSecondary items={initialNavData.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
