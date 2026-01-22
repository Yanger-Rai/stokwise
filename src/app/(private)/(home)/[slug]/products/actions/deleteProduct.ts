import { createClient } from "@/lib/supabase/client";

export async function deleteProductById(productId: string) {
  if (!productId || typeof productId !== "string" || productId.length < 10) {
    return { success: false, error: "Invalid productId" };
  }
  try {
    const supabase = createClient();
    // Delete from inventory first (if you want to enforce cascade manually)
    await supabase.from("inventory").delete().eq("product_id", productId);
    // Delete the product
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Unknown error" };
  }
}
