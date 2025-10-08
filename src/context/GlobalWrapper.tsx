"use client";
import { useState, useEffect } from "react";

import { useBusinessStore, BusinessState } from "@/store/useBusinessStore";

import { Skeleton } from "@/components/ui/skeleton";

// ----------------------------------------------------
// 4. GLOBAL WRAPPER COMPONENT
// ----------------------------------------------------

interface GlobalWrapperProps {
  ownerId: string; // The ID of the authenticated user
  children: React.ReactNode;
}

const GlobalWrapper: React.FC<GlobalWrapperProps> = ({ ownerId, children }) => {
  // Use a temporary state to track if the store has been initialized
  const [hasInitialized, setHasInitialized] = useState(false);

  // Select state and actions from the Zustand store with explicit typing
  const isLoading = useBusinessStore((state: BusinessState) => state.isLoading);
  const error = useBusinessStore((state: BusinessState) => state.error);

  const fetchGlobalData = useBusinessStore(
    (state: BusinessState) => state.fetchGlobalData
  );

  useEffect(() => {
    // Only run this logic if the ownerId is available and initialization hasn't occurred
    if (ownerId && !hasInitialized) {
      // Check if a business was previously selected in the store, otherwise pass null
      const initialBusinessId =
        useBusinessStore.getState().currentBusiness?.id || null;

      fetchGlobalData(ownerId, initialBusinessId).then(() => {
        setHasInitialized(true);
      });
    } else if (!ownerId && !hasInitialized) {
      // Handle case where auth returns no user (should be handled by layout/middleware)
      setHasInitialized(true);
      useBusinessStore.setState({
        isLoading: false,
        currentUser: null,
        businesses: [],
        dynamicNav: [],
      });
    }
    // We only rely on ownerId to trigger the *initial* fetch.
    // Subsequent refreshes are handled by fetchGlobalData/refetchData which update the Zustand state.
  }, [ownerId, hasInitialized, fetchGlobalData]); // <<< Added fetchGlobalData to dependency array

  // --- Loading/Error State Render ---
  // We use the Zustand isLoading/error state directly for UI rendering
  // if (isLoading) {
  //   return (
  //     <div className="p-8 space-y-4">
  //       <Skeleton className="h-8 w-1/4" />
  //       <Skeleton className="h-4 w-1/2" />
  //       <Skeleton className="h-96 w-full" />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">Application Error</h1>
        <p>{error}</p>
        <p className="mt-4">Please log out and try again.</p>
      </div>
    );
  }

  // Render children only once the data is loaded/initialized.
  // The state itself is provided via the Zustand hook, not via Context Provider.
  return <>{children}</>;
};

// Exporting the old hook name for compatibility (though it will be removed/replaced in other components)
export { useBusinessStore as useGlobalData };

export default GlobalWrapper;
