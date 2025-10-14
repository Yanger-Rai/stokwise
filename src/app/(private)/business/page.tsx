"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/modules/business/components/business-card";
import NewBusiness from "@/modules/business/components/newBusiness";
import LoadingPage from "@/components/loadingPage";
import BusinessHeader from "@/modules/business/components/business-header";

import { useBusinessStore } from "@/store/useBusinessStore";
import { BusinessRow } from "@/types/stores.type";
import { FileStack } from "lucide-react";

const BusinessPage = () => {
  const router = useRouter();

  const businesses = useBusinessStore((state) => state.businesses);
  const loading = useBusinessStore((state) => state.isLoading);
  const setCurrentBusiness = useBusinessStore(
    (state) => state.setCurrentBusiness
  );

  // --- states ---
  const [searchValue, setSearchValue] = useState("");

  const hasBusinesses = businesses && businesses.length > 0;

  const filteredBusiness = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectBusiness = async (business: BusinessRow) => {
    setCurrentBusiness(business);
    router.push(`/${business.slug}/dashboard`);
  };

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
          <Input
            placeholder="Search for a business"
            className="max-w-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <NewBusiness />
        </div>

        {/* Main Content */}
        {loading ? (
          <LoadingPage />
        ) : hasBusinesses ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredBusiness.length === 0 ? (
              <div className="py-12 text-center border rounded-lg p-6">
                <FileStack className="m-auto size-14 text-primary/50" />
                <p className="text-muted-foreground mt-2">
                  No Businesses Found
                </p>
              </div>
            ) : (
              filteredBusiness.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onClick={() => handleSelectBusiness(business)}
                />
              ))
            )}
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
