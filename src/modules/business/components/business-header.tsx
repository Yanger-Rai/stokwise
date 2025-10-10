"use client";
import ProfileDropdown from "@/components/profile-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Command } from "lucide-react";
import React from "react";

const BusinessHeader = () => {
  const currentUser = useBusinessStore((state) => state.currentUser);

  if (!currentUser) {
    return null;
  }

  return (
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
          <span className="truncate font-medium">
            {currentUser?.name}&apos;s Business
          </span>
        </div>
      </div>
      <ProfileDropdown user={currentUser}>
        <Button variant={"ghost"} size={"icon"} className="cursor-pointer">
          <Avatar className="size-10 rounded-full">
            <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} />
            <AvatarFallback className="rounded-lg">
              {currentUser?.name?.charAt(0) ?? "SW"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </ProfileDropdown>
    </div>
  );
};

export default BusinessHeader;
