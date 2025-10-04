import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey || !supabaseUrl) {
  console.error(
    "Supabase credential missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
  );
}

// Create the Client-side (Anon Key) Supabase client instance.
// This client is primarily used for authentication functions (signIn, signUp) and Realtime.
// Avoid using it for general data fetching (use the server client instead).
export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseKey!);
}
