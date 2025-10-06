"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Handlees user sign-in with email and password
 * Redirects to the dashboard ("/") on success or back to the login page with an error message on failure
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // !Type validation pending
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login Error: ", error.message);

    const errorMessage = "Invalid credentials or user not confirmed.";
    redirect(`/login?error=${encodeURIComponent(errorMessage)}$mode=login`);
  }
  // After successful loggin, redirect to the main app
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Handles user sign-up with email and password
 * Redirects back to the login page with a success/error message
 */

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // !Type validation pending
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Basic password match validation (should also be handled client-side)
  if (data.password !== data.confirmPassword) {
    const errorMessage = "Passwords do not match.";
    redirect(`/login?error=${encodeURIComponent(errorMessage)}&mode=signup`);
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Signup Error:", error.message);
    const errorMessage =
      "Signup failed. A user with this email might already exist.";
    // Redirect back to the signup form with the error message
    redirect(`/login?error=${encodeURIComponent(errorMessage)}&mode=signup`);
  }

  // After successful signup (which sends a confirmation email),
  // redirect to the login page with a success message.
  const successMessage =
    "Success! Check your email to confirm your account and then log in.";
  redirect(`/login?message=${encodeURIComponent(successMessage)}&mode=login`);
}
