"use client";

import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import ProfileDropdown from "../profile-dropdown";
import { useBusinessStore } from "@/store/useBusinessStore";

export function NavUser() {
  const { isMobile } = useSidebar();

  // --- Use selector functions to get only needed slices of state ---
  const currentUser = useBusinessStore((state) => state.currentUser);

  // Fallback check: If data is still loading or the user object is null,
  // don't render the main content. The GlobalWrapper handles the full loading skeleton,
  // but we must protect against a null user for the NavUser component.
  if (!currentUser) {
    // Return an empty sidebar structure if possible, or defer to the parent loading state.
    // Given the page level security, if we reach here and it's not loading, there's an issue,
    // but returning null is safe and fast.
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ProfileDropdown user={currentUser} isMobile={isMobile}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="rounded-lg">
                {currentUser.name?.charAt(0) ?? "SW"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{currentUser.name}</span>
              <span className="truncate text-xs">{currentUser.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </ProfileDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
