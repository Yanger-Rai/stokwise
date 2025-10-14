"use client";
import { useBusinessStore } from "@/store/useBusinessStore";
import { BusinessRow } from "@/types/stores.type";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

interface HomeWrapperProps {
  slug: string;
  children: React.ReactNode;
}

const HomeWrapper = ({ slug, children }: HomeWrapperProps) => {
  // Use client-side logic to ensure the URL slug matches the active business
  const { currentBusiness, businesses, setCurrentBusiness, isLoading } =
    useBusinessStore();

  useEffect(() => {
    // 1. Wait until the store has finished loading the user's businesses
    if (isLoading) return;

    // 2. Determine if the current state is valid

    // A. User is on the correct page (slug matches state)
    if (currentBusiness && currentBusiness.slug === slug) {
      // All good. We are synced.
      return;
    }

    // B. User manually edited the URL to a different, valid business they own
    const matchingBusiness = businesses.find(
      (b: BusinessRow) => b.slug === slug
    );

    if (matchingBusiness) {
      // Found a matching business! Sync the global state to this new one.
      console.log(`URL slug changed. Syncing active business to: ${slug}`);
      setCurrentBusiness(matchingBusiness);
      // No need to redirect, just update state.
      //TODO - when current business change, update the nav, make a function in zustand
      return;
    }

    // C. User edited the URL to an invalid slug, or a business they don't own,
    // or we loaded, and the default currentBusiness somehow didn't match the URL (e.g., a hard refresh).

    // Fallback: Redirect to the user's *current active* business page.
    if (currentBusiness) {
      console.warn(
        `Invalid/Mismatched slug in URL: ${slug}. Redirecting to ${currentBusiness.slug}.`
      );
      // Use client-side redirect for safety and instantaneous feedback.
      redirect(`/${currentBusiness.slug}/dashboard`);
      return;
    }

    // Fallback: No current business is set (e.g., first login, or state cleared), redirect to business setup/selection page.
    if (businesses.length > 0) {
      // If they have businesses but none is selected, redirect them to the selection page
      redirect("/business");
    } else {
      // If they have no businesses, redirect to the creation page (which /business handles)
      redirect("/business");
    }
  }, [isLoading, slug, currentBusiness, businesses, setCurrentBusiness]);

  return <div>{children}</div>;
};

export default HomeWrapper;
