"use server";
import { createClient } from "@/lib/supabase/server";
import { ProductFormData } from "@/types/product.type";

export async function addProduct(productData: ProductFormData) {
  try {
    // Basic input validation
    const requiredFields = [
      "name",
      "sku",
      "category_id",
      "store_id",
      "stock",
      "minLevel",
    ];
    for (const field of requiredFields) {
      if (
        productData[field as keyof ProductFormData] === undefined ||
        productData[field as keyof ProductFormData] === null ||
        (typeof productData[field as keyof ProductFormData] === "string" &&
          productData[field as keyof ProductFormData] === "")
      ) {
        return { success: false, error: `Missing required field: ${field}` };
      }
    }
    console.log("Adding product with data:", productData);
    const supabase = await createClient();

    // Check for duplicate SKU in the same store
    const { data: existingSku } = await supabase
      .from("products")
      .select("id")
      .eq("sku", productData.sku)
      .eq("store_id", productData.store_id)
      .single();
    if (existingSku) {
      return {
        success: false,
        error: "A product with this SKU already exists in the selected store.",
      };
    }

    // Insert product
    const { data: productArr, error: productError } = await supabase
      .from("products")
      .insert({
        name: productData.name,
        sku: productData.sku,
        store_id: productData.store_id,
        category_id: productData.category_id,
        // image_url: productData.imageUrl ?? null, // if you support images
      })
      .select();
    const product = Array.isArray(productArr) ? productArr[0] : productArr;

    if (productError || !product) {
      console.error("Error inserting product:", productError);
      return {
        success: false,
        error: productError?.message || "Failed to add product.",
      };
    }

    // Insert inventory
    const { error: inventoryError } = await supabase.from("inventory").insert({
      product_id: product.id,
      stock_quantity: productData.stock,
      min_level: productData.minLevel,
    });

    if (inventoryError) {
      return { success: false, error: inventoryError.message };
    }

    // RLS policies will enforce business rules and ownership
    return { success: true, product };
  } catch (err: any) {
    console.error("addProduct: Unexpected error", err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}
