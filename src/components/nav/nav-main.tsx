import { ChevronRight, type LucideIcon } from "lucide-react";

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
import { useStore } from "../store-wrapper";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { storeSlug } = useStore(); // <-- GET THE SLUG

  // Function to correctly prefix the URL with the storeSlug
  const getStoreUrl = (url: string) => {
    // If the URL is just '/', return the slug root: '/mystore'
    if (url === "/") {
      return `/${storeSlug}`;
    }
    // Otherwise, prepend the slug: '/mystore/products'
    return `/${storeSlug}${url}`;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // 1. Get the store-prefixed URL for the main item
          const mainUrl = getStoreUrl(item.url);

          // 2. Determine active state based on the store-prefixed URL
          const isActive =
            item.url === "/"
              ? pathname === mainUrl // Match root dashboard exactly
              : pathname.startsWith(mainUrl); // Match other pages (e.g., /mystore/products)

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  // 3. Conditionally apply the variant based on the active state
                  className={clsx(
                    isActive ? "bg-primary text-primary-foreground" : "inherite"
                  )}
                  asChild
                  tooltip={item.title}
                >
                  {/* 4. Use the prefixed URL in the Link component */}
                  <Link href={mainUrl}>
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
                          // 5. Get the store-prefixed URL for the sub-item
                          const subUrl = getStoreUrl(subItem.url);
                          // 6. Determine if the sub-item is active
                          const isSubActive = pathname === subUrl;

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
                                {/* 7. Use the prefixed URL in the Link component */}
                                <Link href={subUrl}>
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
