"use client";
import React from "react";

import ProfileDropdown from "@/components/profile-dropdown";
import { Command } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/modules/business/components/business-card";
import NewBusiness from "@/modules/business/components/newBusiness";

// import context
import { useGlobalData } from "@/context/GlobalWrapper";
import BusinessHeader from "@/modules/business/components/business-header";

const BusinessPage = () => {
  const { currentUser, businesses, isLoading, setCurrentBusiness } =
    useGlobalData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your business...
          </p>
        </div>
      </div>
    );
  }

  const hasBusinesses = businesses && businesses.length > 0;

  return (
    <div className="min-h-screen">
      {/* header */}
      <BusinessHeader />

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
        {hasBusinesses ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                title={business.name}
                // You don't have location data on the business table, so we'll use slug for now
                location={business.slug}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border rounded-lg p-6 bg-muted/50">
            <h2 className="text-xl font-semibold">No Businesses Found</h2>
            <p className="text-muted-foreground mt-2">
              It looks like you haven&apos;t created any businesses yet. Click
              &quot;New Business&quot; to get started!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusinessPage;
