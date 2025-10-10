import { createClient } from "@/lib/supabase/client";
import { BusinessRow, CategoryRow, StoreData } from "@/types/stores.type";

/**
 * Fetches all businesses for the owner, finds the active business,
 * and loads the stores/categories for that active business.
 * @param ownerId The ID of the authenticated user.
 * @param activeBusinessId Optional ID of the currently selected business.
 */
export async function fetchBusinessData(
  ownerId: string,
  activeBusinessId: string | null = null
): Promise<{
  stores: StoreData[];
  categories: CategoryRow[];
}> {
  const supabase = createClient();

  const defaultReturn = {
    stores: [],
    categories: [],
  };

  // 1. Fetch Businesses Owned by User
  const { data: businessList, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", ownerId);

  if (businessError) {
    console.error("Supabase Error fetching businesses:", businessError);
    return defaultReturn;
  }

  const businesses = businessList || [];

  //   3. Fetch Stores and Categories for the Active Business

  //   FIX: Removed invalid count aggregation (*, totalItems:count(*))
  //   The 'count' column is not a standard column on the 'stores' table.
  //   To keep the StoreData type compatible, we will default totalItems to 0 in the mapping.
  //   const [storesResult, categoriesResult] = await Promise.all([
  //     supabase
  //       // FIX: Use new type inference / generic syntax on .select<T>()
  //       .from("stores")
  //       .select<string, Omit<StoreData, "totalItems">>()
  //       .eq("business_id", activeBusiness.id),

  //     supabase
  //       // FIX: Use new type inference / generic syntax on .select<T>()
  //       .from("categories")
  //       .select<string, CategoryRow>()
  //       .eq("business_id", activeBusiness.id),
  //   ]);

  //   if (storesResult.error)
  //     console.error("Supabase Error fetching stores:", storesResult.error);
  //   if (categoriesResult.error)
  //     console.error(
  //       "Supabase Error fetching categories:",
  //       categoriesResult.error
  //     );

  //   // Convert the fetched Store data to the expected StoreData format (adding the mock field)
  //   const combinedStores: StoreData[] = (storesResult.data || []).map(
  //     (store) => ({
  //       ...store,
  //       totalItems: 0, // Mocked until proper aggregation logic is implemented
  //       slug: store.name.toLowerCase().replace(/\s+/g, "-"),
  //     })
  //   );

  //   const categories = categoriesResult.data || [];

  return {
    stores: [],
    categories: [],
  };
}
