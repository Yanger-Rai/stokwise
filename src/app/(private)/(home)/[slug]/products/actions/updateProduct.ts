import { createClient } from "@/lib/supabase/client";
import { ProductFormData } from "@/types/product.type";

export async function updateProduct(
  productId: string,
  productData: ProductFormData
) {
  if (!productId || typeof productId !== "string" || productId.length < 10) {
    return { success: false, error: "Invalid productId" };
  }
  try {
    const supabase = createClient();
    // Check for duplicate SKU in the same store/category, excluding this product
    const { data: existingSkus, error: skuError } = await supabase
      .from("products")
      .select("id")
      .eq("sku", productData.sku)
      .eq("store_id", productData.store_id)
      .eq("category_id", productData.category_id)
      .neq("id", productId);
    if (skuError) {
      return { success: false, error: skuError.message };
    }
    if (Array.isArray(existingSkus) && existingSkus.length > 0) {
      return {
        success: false,
        error:
          "A product with this SKU already exists in the selected store and category.",
      };
    }
    // Update product
    const { error: productError } = await supabase
      .from("products")
      .update({
        name: productData.name,
        sku: productData.sku,
        store_id: productData.store_id,
        category_id: productData.category_id,
        // image_url: productData.imageUrl ?? null, // if you support images
      })
      .eq("id", productId);
    if (productError) {
      return { success: false, error: productError.message };
    }
    // Update inventory
    const { error: inventoryError } = await supabase
      .from("inventory")
      .update({
        stock_quantity: productData.stock,
        min_level: productData.minLevel,
      })
      .eq("product_id", productId);
    if (inventoryError) {
      return { success: false, error: inventoryError.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Unknown error" };
  }
}
