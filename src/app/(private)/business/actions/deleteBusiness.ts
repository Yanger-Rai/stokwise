"use server";

import { createClient } from "@/lib/supabase/server";
import { BusinessRow } from "@/types/stores.type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteBusiness(data: BusinessRow) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect unauthenticated users
    redirect("/login");
  }

  // 1. delete the business
  const { error } = await supabase
    .from("businesses")
    .delete()
    .eq("id", data.id);

  if (error) {
    console.error("Supabase Error deleting Business:", error);

    return {
      error: "Failed to delete business. Please try again",
      success: false,
    };
  }

  // 2. Revaliate cache on the relavant pages/layout
  // This is the key steps: It tells Next.js to re-fetch business data on the client
  revalidatePath("/business");
  revalidatePath("/dashboard", "layout");

  return { error: null, success: true };
}
