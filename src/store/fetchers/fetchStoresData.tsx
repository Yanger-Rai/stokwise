import { createClient } from "@/lib/supabase/client";
import { StoreData } from "@/types/stores.type";

/**
 * Fetches all stores for the owner
 * and loads the stores for that active business.
 * @param activeBusinessId  ID of the currently selected business.
 */
export async function fetchStoresData(
  activeBusinessId: string | null = null
): Promise<{
  stores: StoreData[];
}> {
  const defaultReturn = {
    stores: [],
  };

  if (!activeBusinessId) return defaultReturn;

  const supabase = createClient();

  // 1. Fetch Businesses Owned by User
  const { data: storeList, error: storeError } = await supabase
    .from("stores")
    .select("*")
    .eq("business_id", activeBusinessId);

  if (storeError) {
    console.error("Supabase Error fetching stores:", storeError);
    return defaultReturn;
  }

  const stores = storeList || [];

  return {
    stores,
  };
}
