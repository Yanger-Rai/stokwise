import ProfileDropdown from "@/components/profile-dropdown";
import { Command } from "lucide-react";
import React from "react";
import { initialNavData } from "@/mock/initialNavData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/modules/business/components/business-card";
import NewBusiness from "@/modules/business/components/newBusiness";

const BusinessPage = () => {
  return (
    <div className="min-h-screen">
      {/* header */}
      <div
        id="business_header"
        className="inline-flex items-center justify-between w-full border-b p-4"
      >
        <div className="flex items-center gap-4">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Command className="size-4" />
          </div>
          /
          <div className="flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Yanger&apos;s Business</span>
          </div>
        </div>
        <ProfileDropdown user={initialNavData.user}>
          <Button variant={"ghost"} size={"icon"} className="cursor-pointer">
            <Avatar className="size-10 rounded-full">
              <AvatarImage
                src={initialNavData.user.avatar}
                alt={initialNavData.user.name}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </Button>
        </ProfileDropdown>
      </div>

      {/* main */}
      <main className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight">Businesses</h1>

        {/* Filters and Add Business */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <Input placeholder="Search for a business" className="max-w-sm" />
          <NewBusiness />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <BusinessCard title="Dispo Store" location="New Market" />
          <BusinessCard title="Dispo Store" location="New Market" />
          <BusinessCard title="Dispo Store" location="New Market" />
          <BusinessCard title="Dispo Store" location="New Market" />
        </div>
      </main>
    </div>
  );
};

export default BusinessPage;
