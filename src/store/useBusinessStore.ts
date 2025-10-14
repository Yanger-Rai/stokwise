import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { BusinessRow, CategoryRow, StoreData } from "@/types/stores.type";
import { NavMainItem, User } from "@/types/nav.type";
import { Bot, SquareTerminal, StoreIcon } from "lucide-react";
import { fetchBusinessData } from "./fetchers/fetchBusinessdata";
import { devtools, persist } from "zustand/middleware";
import { fetchCategoriesData } from "./fetchers/fetchStoresCategories";

// --- Static Navigation Data (Moved Locally) ---
const navMainStatic: NavMainItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: SquareTerminal, items: [] },
  // Other static links go here if needed
];

// --- Helper Function ---
/**
 * Builds the dynamic navigation structure
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
      url: `/stores/${store.id}`,
    })),
  };

  return [productsNav, storesNav];
}

// --- Store Interface ---

export interface BusinessState {
  // Data
  currentUser: User | null;
  businesses: BusinessRow[];
  currentBusiness: BusinessRow | null;
  stores: StoreData[];
  categories: CategoryRow[];
  dynamicNav: NavMainItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchGlobalData: (
    ownerId: string,
    initialBusinessId?: string | null
  ) => Promise<void>;
  setCurrentBusiness: (business: BusinessRow) => void;
  refetchData: () => Promise<void>;
  fetchGlobalStoreCategories: (currentBusinessId: string) => Promise<void>;
}

// --- Zustand Store Definition ---

export const useBusinessStore = create<BusinessState>()(
  // Wrapping zustant store with devtools so we can make sure of Redux devtool UI in browser
  persist(
    devtools((set, get) => ({
      // Initial State
      currentUser: null,
      businesses: [],
      currentBusiness: null,
      stores: [],
      categories: [],
      dynamicNav: navMainStatic,
      isLoading: true,
      error: null,

      // Actions

      /**
       * Switches the currently active business and triggers a data refresh.
       */
      setCurrentBusiness: (business: BusinessRow) => {
        set({ currentBusiness: business });
      },

      /**
       * Manually triggers a re-fetch of all global data.
       */
      refetchData: async () => {
        const ownerId = get().currentUser?.id;
        const currentBusinessId = get().currentBusiness?.id;
        // Only fetch if authenticated
        if (ownerId) {
          await get().fetchGlobalData(ownerId, currentBusinessId);
        }
      },

      /**
       * Fetches all user and business-specific data from Supabase.
       */
      fetchGlobalData: async (ownerId) => {
        set({ isLoading: true, error: null });

        try {
          const supabase = createClient();

          // --- 1. Fetch User Profile Data ---
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            // In case of stale token, clear state and stop loading
            set({
              isLoading: false,
              currentUser: null,
              businesses: [],
              dynamicNav: navMainStatic,
            });

            throw new Error("User session not found.");
          }

          // --- 1. Set User Data ---
          const userName =
            user.user_metadata.full_name || user.email?.split("@")[0] || "User";
          const userAvatar = user.user_metadata.avatar_url || "";

          const userData: User = {
            id: user.id,
            name: userName,
            email: user.email || "",
            avatarUrl: userAvatar,
          };
          set({ currentUser: userData });

          // --- 2. Fetch all Businesses ---
          const { businesses } = await fetchBusinessData(user.id);

          const newDynamicNav = buildDynamicNav([], []);

          // 3. Update all state slices in one go
          set({
            businesses,
            dynamicNav: [...navMainStatic, ...newDynamicNav],
            isLoading: false,
          });
        } catch (e) {
          console.error("Global Data Fetch Error:", e);
          set({
            error: `Failed to load application data: ${
              e instanceof Error ? e.message : "Unknown error"
            }`,
            isLoading: false,
          });
        }
      },

      /**
       * Fetch all stores and categories data based on current business
       */
      fetchGlobalStoreCategories: async (currentBusinessId: string) => {
        set({ isLoading: true, error: null });

        try {
          const { categories } = await fetchCategoriesData(currentBusinessId);
          const newDynamicNav = buildDynamicNav([], categories);

          set({
            dynamicNav: [...navMainStatic, ...newDynamicNav],
            isLoading: false,
            categories,
          });
        } catch (err) {
          console.error("Gloabl Categories Fetch error:", err);
          set({
            isLoading: false,
            error: `Failed to load categories data: ${
              err instanceof Error ? err.message : "Unknown error"
            }`,
          });
        }
      },
    })),
    {
      name: "BusinessStore", // Naming the store to be seen in redux DevTool UI
      // 👈 CRITICAL: We now include the necessary arrays and navigation structure for immediate UI stability.
      partialize: (state: BusinessState): Partial<BusinessState> => ({
        currentUser: state.currentUser,
        businesses: state.businesses,
        currentBusiness: state.currentBusiness,
        stores: state.stores,
        categories: state.categories,
        dynamicNav: state.dynamicNav,
      }),
    }
  )
);
