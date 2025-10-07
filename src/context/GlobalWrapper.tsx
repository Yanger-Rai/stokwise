"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { initialMockUser } from "@/mock/initialNavData";
import { NavMainItem, User } from "@/types/nav.type";
import { BusinessRow, CategoryRow, StoreData } from "@/types/stores.type";
import { Bot, StoreIcon } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

// -----------------------------
// 1. EXTENDED CONTEXT TYPE
// -----------------------------

interface GlobalContextType {
  // User Data
  currentUser: User;

  // Business Data
  businesses: BusinessRow[];
  // The business currently active (needed for all operations)
  currentBusiness: BusinessRow | null;

  // Inventory/ Nav Data
  stores: StoreData[];
  categories: CategoryRow[];

  // Dynamically built navigation data for the side bar
  dynamicNav: NavMainItem[];

  isLoading: boolean;
  error: string | null;
  // Action
  setCurrentBusiness: (business: BusinessRow) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// -----------------------------
// 2. CONTEXT HOOK
// -----------------------------

// Hook to use the gloabl data throughout the app
export function useGlobalData() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalData must be used within a GlobalWrapper");
  }
  return context;
}

// -----------------------------
// 3. HELPER FUNCTION
// -----------------------------

/**
 *  Builds the dynamic navigation structure
 */
function buildDynamicNav(
  stores: StoreData[],
  categories: CategoryRow[]
): NavMainItem[] {
  const productsNav: NavMainItem = {
    title: "Products",
    url: "/products",
    icon: Bot,
    items: categories.map((cat) => ({
      title: cat.name,
      url: `/products/${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
    })),
  };

  const storesNav: NavMainItem = {
    title: "Stores",
    url: "/stores",
    icon: StoreIcon,
    items: stores.map((store) => ({
      title: store.name,
      url: `/stores/${store.id}`, // Use slug if available, fallback to id
    })),
  };

  return [productsNav, storesNav];
}

// ----------------------------------------------------
// 4. GLOBAL WRAPPER COMPONENT
// ----------------------------------------------------

interface GlobalWrapperProps {
  ownerId: string; // The ID of the authenticated user
  children: React.ReactNode;
}

const GlobalWrapper: React.FC<GlobalWrapperProps> = ({ ownerId, children }) => {
  const supabase = createClient();

  const [currentUser, setCurrentUser] = useState<User>(initialMockUser);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [currentBusiness, _setCurrentBusiness] = useState<BusinessRow | null>(
    null
  );
  const [stores, setStores] = useState<StoreData[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [dynamicNav, setDynamicNav] = useState<NavMainItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to switch the active business (API call pending implementation)
  const setCurrentBusiness = (business: BusinessRow) => {
    // In a real app, this would involve setting a cookie/local state
    // and potentially reloading the entire app context data based on the new businessId
    _setCurrentBusiness(business);
    // TODO: Implement logic to update stores/categories when business changes
  };

  useEffect(() => {
    async function fetchGlobalData() {
      setIsLoading(true);
      setError(null);

      try {
        // --- 1. Fetch User Profile Data (from auth and potentially profiles table) ---
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Should not happen if middleware is correct, but safe check
          throw new Error("User session not found.");
        }

        const userName =
          user.user_metadata.full_name || user.email?.split("@")[0] || "User";
        const userAvatar = user.user_metadata.avatar_url || null;

        const userData: User = {
          id: user.id,
          name: userName,
          email: user.email || "",
          avatarUrl: userAvatar,
        };
        setCurrentUser(userData);

        // --- 2. Fetch Businesses Owned by User ---
        const { data: businessList, error: businessError } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", user.id);

        if (businessError) throw new Error(businessError.message);

        setBusinesses(businessList || []);

        const activeBusiness = businessList?.[0] || null; // Select the first business as the default active one

        if (!activeBusiness) {
          _setCurrentBusiness(null);
          setStores([]);
          setCategories([]);
          setDynamicNav(buildDynamicNav([], []));
          setIsLoading(false);
          return;
        }

        _setCurrentBusiness(activeBusiness);

        // --- 3. Fetch Stores and Categories for the Active Business ---
        const [storesResult, categoriesResult] = await Promise.all([
          supabase
            .from("stores")
            .select("*")
            .eq("business_id", activeBusiness.id)
            .returns<StoreData[]>(),
          supabase
            .from("categories")
            .select("*")
            .eq("business_id", activeBusiness.id)
            .returns<CategoryRow[]>(),
        ]);

        if (storesResult.error) throw new Error(storesResult.error.message);
        if (categoriesResult.error)
          throw new Error(categoriesResult.error.message);

        // Combine StoreRow with the derived field (StoreData)
        const combinedStores: StoreData[] = (storesResult.data || []).map(
          (store) => ({
            ...store,
            totalItems: 0, // Placeholder for aggregation logic
            slug: store.name.toLowerCase().replace(/\s+/g, "-"), // Add slug for nav consistency
          })
        );

        setStores(combinedStores);
        setCategories(categoriesResult.data || []);

        // --- 4. Build Dynamic Navigation ---
        setDynamicNav(
          buildDynamicNav(combinedStores, categoriesResult.data || [])
        );
      } catch (e) {
        console.error("Global Data Fetch Error:", e);
        setError(
          `Failed to load application data: ${
            e instanceof Error ? e.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (ownerId) {
      fetchGlobalData();
    } else {
      setIsLoading(false);
    }
  }, [ownerId]);

  // --- Loading/Error State Render ---
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

  // If no businesses, guide user to the business page for creation
  // if (!currentBusiness && !businesses.length) {
  //   // You might redirect here, but rendering a message keeps the URL clean if they just landed on dashboard
  //   return (
  //     <div className="p-8 text-center text-gray-500">
  //       <h1 className="text-2xl font-bold">Welcome to StokWise!</h1>
  //       <p className="mt-2">
  //         It looks like you need to set up your first business. Please navigate
  //         to the{" "}
  //         <a href="/business" className="text-primary underline">
  //           Business Page
  //         </a>{" "}
  //         to get started.
  //       </p>
  //     </div>
  //   );
  // }

  const value: GlobalContextType = {
    currentUser,
    businesses,
    currentBusiness,
    stores,
    categories,
    dynamicNav,
    isLoading: false,
    setCurrentBusiness,
    error,
  };

  // Provide the combined data to the entire private application
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalWrapper;
