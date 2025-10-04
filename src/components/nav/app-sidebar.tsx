"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
// import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { initialNavData } from "@/mock/initialNavData";
import { BusinessSwitcher } from "./business-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <BusinessSwitcher teams={initialNavData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={initialNavData.navMain} />
        {/* <NavSecondary items={initialNavData.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={initialNavData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
