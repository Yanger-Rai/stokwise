"use server";

import { createClient } from "@/lib/supabase/server";
import { CategoryRow, NewCategory } from "@/types/stores.type";
import { redirect } from "next/navigation";

type ActionResult = {
  success: boolean;
  message: string;
  category?: CategoryRow;
};

export async function addCategory(
  categoryName: string,
  businessId: string
): Promise<ActionResult> {
  // --- 1. Input validation ---
  if (!categoryName || categoryName.trim() === "") {
    return { success: false, message: "category name cannot be emtpy" };
  }

  if (!businessId) {
    return {
      success: false,
      message: "Business Id is required for category creation.",
    };
  }

  // --- 2. Initialize Supabase client ---
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // --- 3. Prepare Data Payload ---
  const NewCategoryData: NewCategory = {
    name: categoryName.trim(),
    business_id: businessId,
  };

  try {
    // --- 4. Database Insertion ---
    const { data, error } = await supabase
      .from("categories")
      .insert(NewCategoryData)
      .select()
      .single(); // use single to ensure we get the created row back

    if (error) {
      console.error("Supabase Category Insert Error:", error);
      return { success: false, message: `Database error: ${error.message}` };
    }

    if (!data) {
      return {
        success: false,
        message: "Category created but no data returned.",
      };
    }

    // --- 5. Revalidate (for data fetchjing in other server component) ---
    // If you have a path that displays the categories, revalidate it.

    // --- 6. Success Response ---
    return {
      success: true,
      message: `Category '${data.name}' successfully added.`,
      category: data as CategoryRow,
    };
  } catch (err) {
    console.error("Category Creation fatal error:", err);
    return {
      success: false,
      message: "An unexpected error occured during category creation.",
    };
  }
}
