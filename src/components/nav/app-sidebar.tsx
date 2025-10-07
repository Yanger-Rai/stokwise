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
import { initialNavData } from "@/mock/initialNavData";
import { BusinessSwitcher } from "./business-switcher";
import { useGlobalData } from "@/context/GlobalWrapper";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { dynamicNav, currentUser } = useGlobalData();

  // Combine the static navigation items with the dynamically generated ones
  const fullNav = [...initialNavData.navMainStatic, ...dynamicNav];
  console.log("bikash ---sidebar", { initialNavData, dynamicNav });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <BusinessSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={fullNav} />
        {/* <NavSecondary items={initialNavData.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
