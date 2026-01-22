import { createClient } from "@/lib/supabase/client";

export async function fetchProductsForBusiness(businessId: string) {
  // Guard: Validate businessId
  if (!businessId || typeof businessId !== "string" || businessId.length < 10) {
    console.error("fetchProductsForBusiness: Invalid businessId", businessId);
    return { success: false, error: "Invalid businessId", products: [] };
  }
  try {
    const supabase = createClient();
    // Step 1: Fetch products for the business (with category/store joins)
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(
        `*, categories:category_id(name), stores:store_id(name, business_id)`
      )
      .eq("stores.business_id", businessId);
    if (productsError) {
      console.error(
        "fetchProductsForBusiness: Products fetch error",
        productsError.message
      );
      return { success: false, error: productsError.message, products: [] };
    }
    if (!Array.isArray(productsData)) {
      console.error(
        "fetchProductsForBusiness: Products data is not an array",
        productsData
      );
      return {
        success: false,
        error: "Products data is not an array",
        products: [],
      };
    }
    const productIds = productsData.map((row: any) => row.id).filter(Boolean);
    if (productIds.length === 0) {
      return { success: true, products: [] };
    }
    // Step 2: Fetch inventory for these products
    const { data: inventoryData, error: inventoryError } = await supabase
      .from("inventory")
      .select("product_id, stock_quantity, min_level")
      .in("product_id", productIds);
    if (inventoryError) {
      console.error(
        "fetchProductsForBusiness: Inventory fetch error",
        inventoryError.message
      );
      // Still show products, just without inventory info
    }
    // Step 3: Merge inventory into products
    const inventoryMap = new Map();
    (Array.isArray(inventoryData) ? inventoryData : []).forEach((inv: any) => {
      if (inv && inv.product_id) inventoryMap.set(inv.product_id, inv);
    });
    const products = productsData.map((row: any) => {
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
    console.error("fetchProductsForBusiness: Unexpected error", err);
    return {
      success: false,
      error: err?.message || "Unknown error",
      products: [],
    };
  }
}
