import { createClient } from "@/lib/supabase/client";

export async function fetchProductsByCategory(
  businessId: string,
  categoryId: string
) {
  if (!businessId || typeof businessId !== "string" || businessId.length < 10) {
    return { success: false, error: "Invalid businessId", products: [] };
  }
  if (!categoryId || typeof categoryId !== "string" || categoryId.length < 10) {
    return { success: false, error: "Invalid categoryId", products: [] };
  }
  try {
    const supabase = createClient();
    // Fetch products with store and category join
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(
        `*, categories:category_id(name), stores:store_id(name, business_id)`
      )
      .eq("category_id", categoryId);
    if (productsError) {
      return { success: false, error: productsError.message, products: [] };
    }
    if (!Array.isArray(productsData)) {
      return {
        success: false,
        error: "Products data is not an array",
        products: [],
      };
    }
    // Filter by businessId (since Supabase cannot filter on joined columns)
    const filtered = productsData.filter(
      (row: any) => row.stores?.business_id === businessId
    );
    // Fetch inventory for these products
    const productIds = filtered.map((row: any) => row.id).filter(Boolean);
    let inventoryMap = new Map();
    if (productIds.length > 0) {
      const { data: inventoryData } = await supabase
        .from("inventory")
        .select("product_id, stock_quantity, min_level")
        .in("product_id", productIds);
      (Array.isArray(inventoryData) ? inventoryData : []).forEach(
        (inv: any) => {
          if (inv && inv.product_id) inventoryMap.set(inv.product_id, inv);
        }
      );
    }
    const products = filtered.map((row: any) => {
      const inventory = inventoryMap.get(row.id);
      return {
        id: row.id,
        name: row.name,
        category: row.categories?.name ?? "Unknown",
        store: row.stores?.name ?? "Unknown",
        store_id: row.store_id ?? row.stores?.id ?? "",
        category_id: row.category_id ?? row.categories?.id ?? "",
        sku: row.sku,
        stock: inventory?.stock_quantity ?? 0,
        minLevel: inventory?.min_level ?? 0,
        imageUrl: row.image_url ?? null,
      };
    });
    return { success: true, products };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Unknown error",
      products: [],
    };
  }
}
