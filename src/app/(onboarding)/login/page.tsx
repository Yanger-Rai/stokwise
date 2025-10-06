"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login, signup } from "./actions";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

// --- MAIN AUTHENTICATION PAGE COMPONENT ---
export default function AuthPage() {
  const searchParams = useSearchParams();
  // Determine if we should start in signup mode based on URL or default to false
  const [isSignUp, setIsSignUp] = useState(
    searchParams.get("mode") === "signup"
  );
  const [loading, setLoading] = useState(false);

  // Get messages from URL query parameters (passed from server actions)
  const errorMessage = searchParams.get("error");
  const successMessage = searchParams.get("message");

  // Clear the messages when the user interacts with the form,
  // or when switching between login/signup modes.
  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignUp(!isSignUp);
    // Note: In a production app, you might also use router.replace to clear
    // the query parameters from the URL when switching views for a cleaner state.
  };

  const formAction = isSignUp ? signup : login;

  const handleSubmit = async (formData: FormData) => {
    // Basic client-side validation
    const password = formData.get("password") as string;
    if (isSignUp) {
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        // Since server actions handle redirection, a local alert is a fallback,
        // but for better UX, we rely on the server action redirecting with an error message.
      }
    }

    setLoading(true);
    // The server action handles redirecting on success or error,
    // so we just await it and assume navigation will happen.
    await formAction(formData);
    // If the formAction completed without a redirect, loading would be set back to false here,
    // but we assume a successful server action performs a full navigation.
    setLoading(false);
  };

  const buttonText = isSignUp ? "Sign Up" : "Login";

  return (
    <div className={cn("flex flex-col gap-6")}>
      <form action={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <h1 className="text-xl font-bold">Welcome to StokWise</h1>
            </Link>
            <div className="text-center text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                href="#"
                onClick={toggleMode}
                className="underline underline-offset-4 "
              >
                {isSignUp ? "Login" : "Sign Up"}
              </Link>
            </div>
          </div>

          {/* --- Message/Error Display --- */}
          {(errorMessage || successMessage) && (
            <div
              className={cn(
                "p-3 rounded-md text-sm text-center font-medium",
                errorMessage
                  ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
              )}
            >
              {errorMessage || successMessage}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {isSignUp && (
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : buttonText}
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-4 grid-cols-1">
            {/* Keeping Google button for completeness, though it's not implemented here */}
            <Button variant="outline" type="button" className="w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4 mr-2 fill-current"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
