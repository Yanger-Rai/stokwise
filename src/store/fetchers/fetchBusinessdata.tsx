import { createClient } from "@/lib/supabase/client";
import { BusinessRow } from "@/types/stores.type";

/**
 * Fetches all businesses for the owner, finds the active business,
 * and loads the stores/categories for that active business.
 * @param ownerId The ID of the authenticated user.
 * @param activeBusinessId Optional ID of the currently selected business.
 */
export async function fetchBusinessData(ownerId: string): Promise<{
  businesses: BusinessRow[];
}> {
  const supabase = createClient();

  const defaultReturn = {
    businesses: [],
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

  return {
    businesses,
  };
}
