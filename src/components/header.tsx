"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// This is a Client Component because it uses hooks (usePathname, useState, useEffect).
export default function Header() {
  const pathname = usePathname();
  const [headerTitle, setHeaderTitle] = useState("StockWise");

  useEffect(() => {
    // This logic determines the header title based on the current URL path.
    if (pathname === "/") {
      setHeaderTitle("StockWise Dashboard");
    } else if (pathname.startsWith("/products")) {
      setHeaderTitle("StockWise Products");
    } else if (pathname.startsWith("/reports")) {
      setHeaderTitle("StockWise Reports");
    } else if (pathname.startsWith("/settings")) {
      setHeaderTitle("StockWise Settings");
    } else {
      setHeaderTitle("StockWise");
    }
  }, [pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="font-semibold">{headerTitle}</h1>
      </div>
    </header>
  );
}
