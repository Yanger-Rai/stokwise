"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreData } from "@/types/stores.type";
import { supabase } from "@/lib/supabase/supabase";

// Define the shape of the context state
interface StoreContextType {
  currentStore: StoreData | null;
  storeSlug: string;
  isLoading: boolean;
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
  const [currentStore, setCurrentStore] = useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStore() {
      setIsLoading(true);
      setError(null);

      // 1. Fetch store data using the slug from the URL
      const { data, error: dbError } = await supabase
        .from("stores")
        .select("*")
        .eq("slug", storeSlug);

      if (dbError) {
        setError("Error fetching store data.");
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setCurrentStore(data[0] as StoreData);
      } else {
        // Handle case where store is not found or user is unauthorized (404/403)
        setError(`Store "${storeSlug}" not found or unauthorized.`);
        // In a real app, you would redirect to a 404 page here.
      }
      setIsLoading(false);
    }

    // Only fetch if a slug is present
    if (storeSlug) {
      fetchStore();
    } else {
      setIsLoading(false);
    }
  }, [storeSlug]);

  const value = { currentStore, storeSlug, isLoading };

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
        <p className="mt-4">Please check the URL or sign up for a new store.</p>
      </div>
    );
  }

  if (!currentStore) {
    // If not loading and no error, but still no store data (should be caught by error above, but a safety fallback)
    return (
      <div className="p-8 text-center text-gray-500">
        Store not configured. Please contact support.
      </div>
    );
  }

  // Once the store is loaded, provide it to the children
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export default StoreWrapper;
