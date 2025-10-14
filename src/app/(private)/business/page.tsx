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
import { deleteBusiness } from "./actions/deleteBusiness";
import { toast } from "sonner";
import { FileStack } from "lucide-react";

const BusinessPage = () => {
  const router = useRouter();

  const refetchData = useBusinessStore((state) => state.refetchData);
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

  const handleDeleteBusiness = async (business: BusinessRow) => {
    // Add a simple confirmation step for a destructive action
    if (
      !window.confirm(
        `Are you sure you want to permanently delete the business "${business.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    // Optional: Show a loading toast immediately
    const loadingToastId = toast.loading(`Deleting ${business.name}...`);

    try {
      const response = await deleteBusiness(business);

      // Check for the specific error returned by the Server Action
      if (response.success) {
        toast.success(`SUCCESS: ${business.name} deleted`, {
          id: loadingToastId,
        });

        await refetchData(); // Use await here to ensure state is updated before next render
      } else {
        // Use the error message returned from the server action
        toast.error(`ERROR: ${response.error}`, { id: loadingToastId });
      }
    } catch (err) {
      // Catch unexpected network/JS errors
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(
        `ERROR: Failed to delete ${business.name}. Details: ${errorMessage}`,
        { id: loadingToastId }
      );
    }
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
                  onDelete={() => handleDeleteBusiness(business)}
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
