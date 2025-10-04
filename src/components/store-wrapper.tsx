"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreData, Database } from "@/types/stores.type";
import { createClient } from "@/lib/supabase/client";

// Use utility types to derive the structure from the Database type
type StoreRow = Database["public"]["Tables"]["stores"]["Row"];
type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];

// Define the shape of the context state
interface StoreContextType {
  currentStore: StoreData | null;
  storeSlug: string;
  isLoading: boolean;
  businessName: string | null;
  businessId: string | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Hook to use the store data throughout the app
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreWrapper");
  }
  return context;
}

interface StoreWrapperProps {
  storeSlug: string;
  children: React.ReactNode;
}

const StoreWrapper: React.FC<StoreWrapperProps> = ({ storeSlug, children }) => {
  const supabase = createClient();

  // Enhanced state to hold both store and business context
  const [currentStore, setCurrentStore] = useState<StoreData | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStoreAndBusiness() {
      setIsLoading(true);
      setError(null);
      setBusinessId(null);
      setBusinessName(null);
      setCurrentStore(null);

      // --- 1. Fetch the business data using the slug ---
      const { data: businessData, error: businessError } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("slug", storeSlug)
        .single(); // Assuming slug is unique and only maps to one business

      if (businessError || !businessData) {
        // Handle cases like 404/403 (no business found or RLS denied access)
        setError(`Business "${storeSlug}" not found or unauthorized.`);
        setIsLoading(false);
        return;
      }

      const fetchedBusinessId = businessData.id;
      setBusinessId(fetchedBusinessId);
      setBusinessName(businessData.name);

      // --- 2. Fetch the primary store for this business ---
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .eq("business_id", fetchedBusinessId)
        .limit(1); // Assuming the first store found is the one to use

      if (storeError) {
        setError("Error fetching store data.");
        setIsLoading(false);
        return;
      }

      if (storeData && storeData.length > 0) {
        const primaryStore = storeData[0];
        // Combine the DB row with the mocked/derived field needed for UI compatibility
        const combinedStore: StoreData = {
          ...primaryStore,
          totalItems: 0, // Placeholder: In production, this would be a real-time count or stored column
        };
        setCurrentStore(combinedStore);
      } else {
        // If the business exists but has no stores
        setError(`No stores found for business "${storeSlug}".`);
      }
      setIsLoading(false);
    }

    if (storeSlug) {
      fetchStoreAndBusiness();
    } else {
      setIsLoading(false);
    }
  }, [storeSlug]); // Add `supabase` to dependency array is technically correct, but safe to omit as it's static

  const value = {
    currentStore,
    storeSlug,
    isLoading,
    businessName,
    businessId,
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">Error Loading Store</h1>
        <p>{error}</p>
        <p className="mt-4">Please check the URL or contact support.</p>
      </div>
    );
  }

  if (!currentStore) {
    return (
      <div className="p-8 text-center text-gray-500">
        Store not configured. Please create your first store.
      </div>
    );
  }

  // Once the store is loaded, provide it to the children
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export default StoreWrapper;
