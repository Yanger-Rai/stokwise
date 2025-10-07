"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface NewBusinessData {
  name: string;
  slug: string;
}

export async function createNewBusiness(data: NewBusinessData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect unauthenticated users
    redirect("/login");
  }

  // 1. Insert the new business into the database
  const { data: newBusiness, error } = await supabase
    .from("businesses")
    .insert({
      owner_id: user.id,
      name: data.name,
      slug: data.slug,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase Error during Business Creation:", error);

    // Check for common errors like slug conflict (23505 is unique violation)
    let errorMessage =
      "Failed to create business. Please try a different slug.";

    if (error.code === "23505") {
      errorMessage =
        "A business with this slug already exists. Please choose a unique URL slug.";
    } else {
      errorMessage = `Database error: ${error.message}`;
    }
    return { error: errorMessage, success: false };
  }

  // 2. Revaliate cache on the relavant pages/layout
  // This is the key steps: It tells Next.js to re-fetch business data on the client
  revalidatePath("/business");
  revalidatePath("/dashboard", "layout");

  // Since redirect is called on success, this code is unreachable in practice,
  // but for typing consistency, we return sucess status
  return { error: null, success: true, businessId: newBusiness.id };
}
