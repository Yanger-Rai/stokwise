"use client";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Skeleton } from "../ui/skeleton";

export function NavMain() {
  const pathname = usePathname();

  // Zustant states
  const isLoading = useBusinessStore((state) => state.isLoading);
  const navItems = useBusinessStore((state) => state.dynamicNav);
  const currentBusiness = useBusinessStore((state) => state.currentBusiness);

  if (isLoading) {
    // Return a skeleton while the global data is loading
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="grid w-full p-2 gap-2">
            <Skeleton className="w-full h-6 bg-gray-200" />
            <Skeleton className="w-full h-6 bg-gray-200" />
            <Skeleton className="w-full h-6 bg-gray-200" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Determine the current slug, using zustand as the source of truth. Do not use useParams
  const currentSlug = currentBusiness?.slug;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => {
          // 1. Prepand the slug to the main URL
          const baseSegment = currentSlug ? `/${currentSlug}` : "";
          const fullItemUrl = `${baseSegment}${item.url}`;

          // 2. Check for active state against the full url
          const isActive = pathname.startsWith(fullItemUrl);

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  // 4. Conditionally apply the variant based on the active state
                  className={clsx(
                    isActive ? "bg-primary text-primary-foreground" : "inherite"
                  )}
                  asChild
                  tooltip={item.title}
                >
                  <Link href={fullItemUrl}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          // 5. Build the full URl for the sub-item as well
                          const fullSubItemUrl = `${baseSegment}${subItem.url}`;
                          // 6. Determine if the sub item is active
                          const isSubActive = pathname === fullSubItemUrl;

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                className={clsx(
                                  isSubActive
                                    ? "bg-primary text-primary-foreground"
                                    : "inherite"
                                )}
                                asChild
                              >
                                <Link href={fullSubItemUrl}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
