"use server";

import { createClient } from "@/lib/supabase/server";
import { CategoryRow } from "@/types/stores.type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionResult = {
  success: boolean;
  message: string;
  category?: CategoryRow;
};

export async function deleteCategory(
  categoryId: string
): Promise<ActionResult> {
  // --- 1. Input validation ---
  if (!categoryId || categoryId.trim() === "") {
    return { success: false, message: "category ID cannot be emtpy" };
  }

  // --- 2. Initialize Supabase client ---
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    // --- 4. Database Update ---
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error("Supabase Category Delete Error:", error);
      // IMPORTANT: If products depend on this category, a foreign key constraint
      // error will occur here. You must handle or prevent this deletion.
      return {
        success: false,
        message: `Database error: ${error.message}. Check if products are linked to this category.`,
      };
    }

    // --- 4. Revalidation ---
    revalidatePath("/app/products");

    // --- 5. Success Response ---
    return {
      success: true,
      message: `Category ID ${categoryId} successfully deleted.`,
    };
  } catch (err) {
    console.error("Category Deletion Fatal Error:", err);
    return {
      success: false,
      message: "An unexpected error occurred during category deletion.",
    };
  }
}
