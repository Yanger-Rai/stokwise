// This is a minimal mock for a Supabase client setup,
// using the general configuration pattern you would need.
// In a real project, this would use `@supabase/supabase-js`.

// NOTE: Since your environment uses __firebase_config, you would typically
// initialize Firebase here instead, but for the purpose of demonstrating
// the Supabase/RLS concepts, we'll keep this mock.

const supabaseUrl = "https://mock-supabase-url.co";
const supabaseKey = "mock-api-key";

// Mock Supabase methods needed for this app.
export const supabase = {
  // Mock auth methods
  auth: {
    // In a real app, this gets the current user session
    getUser: async () => ({
      data: {
        user: {
          id: "mock-user-id-123", // Static mock user ID for now
          email: "user@example.com",
        },
      },
    }),
    // Mock sign up for the onboarding flow
    signUp: async (email: string, password: string) => {
      console.log(`Mock sign up for: ${email}`);
      return { data: { user: { id: "mock-user-id-123" } }, error: null };
    },
  },
  // Mock query builder for the 'stores' table
  from: (tableName: string) => {
    return {
      select: (columns: string) => {
        // Mock retrieval of store data based on slug (tenant routing)
        if (tableName === "stores" && columns === "*") {
          return {
            eq: (field: string, value: string) => {
              const mockStores = [
                {
                  id: "1",
                  user_id: "mock-user-id-123",
                  slug: "mystore",
                  name: "My Store",
                  location: "New York",
                  totalItems: 500,
                },
                {
                  id: "2",
                  user_id: "another-user-id",
                  slug: "bobs-shop",
                  name: "Bobs Shop",
                  location: "London",
                  totalItems: 1200,
                },
              ];

              const foundStore = mockStores.find(
                (s) => s[field as keyof typeof s] === value
              );

              if (foundStore) {
                // Return mock data for the found store
                return { data: [foundStore], error: null };
              }
              // Simulate RLS failure if user_id was being checked (not done here for slug search)
              return { data: [], error: null };
            },
          };
        }
        // General mock select
        return {
          data: [],
          error: null,
        };
      },
      // Mock insert for the onboarding flow
      insert: (data: any) => {
        if (tableName === "stores") {
          console.log("Mock: Inserting new store data:", data);
          return {
            data: [{ ...data, id: Math.random().toString(36).substring(7) }],
            error: null,
          };
        }
        return { data: [], error: null };
      },
    };
  },
};
