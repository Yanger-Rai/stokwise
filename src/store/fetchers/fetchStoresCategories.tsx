import { createClient } from "@/lib/supabase/client";
import { CategoryRow } from "@/types/stores.type";

/**
 * Fetches all categories for the owner
 * and loads the categories for that active business.
 * @param activeBusinessId  ID of the currently selected business.
 */
export async function fetchCategoriesData(
  activeBusinessId: string | null = null
): Promise<{
  // stores: StoreData[];
  categories: CategoryRow[];
}> {
  const defaultReturn = {
    // stores: [],
    categories: [],
  };

  if (!activeBusinessId) return defaultReturn;

  const supabase = createClient();

  // 1. Fetch Businesses Owned by User
  const { data: categoriesList, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("business_id", activeBusinessId);

  if (categoriesError) {
    console.error("Supabase Error fetching categories:", categoriesError);
    return defaultReturn;
  }

  const categories = categoriesList || [];

  return {
    categories,
  };
}
