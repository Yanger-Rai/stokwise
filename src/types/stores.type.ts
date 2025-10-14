/**
 * --- Supabase Database Schema Definitions (for RLS/multi-tenant structure) ---
 * These types are essential for creating a fully typed Supabase client instance.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // 1. User Profiles (Extends auth.users)
      profiles: {
        Row: {
          id: string; // References auth.users.id
          created_at: string;
          full_name: string | null; // Used temporarily for business name on creation
        };
        Insert: {
          id: string;
          created_at?: string;
          full_name?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // 2. Businesses (The Tenant)
      businesses: {
        Row: {
          id: string;
          created_at: string;
          owner_id: string; // Foreign Key to profiles.id
          name: string;
          slug: string; // For URL routing, unique identifier
        };
        Insert: {
          id?: string;
          created_at?: string;
          owner_id: string;
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          owner_id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      // 3. Stores (Branches/Locations)
      stores: {
        Row: {
          id: string;
          business_id: string; // Foreign Key to businesses.id
          created_at: string;
          name: string;
          location: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          created_at?: string;
          name: string;
          location?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          created_at?: string;
          name?: string;
          location?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "stores_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          }
        ];
      };

      // 4. Categories
      categories: {
        Row: {
          id: string;
          business_id: string; // Foreign Key to businesses.id
          created_at: string;
          name: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          created_at?: string;
          name: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          created_at?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          }
        ];
      };

      // 5. Product Definitions (Master List)
      products: {
        Row: {
          id: string;
          business_id: string;
          category_id: string | null;
          created_at: string;
          name: string;
          sku: string;
          price: number;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          category_id?: string | null;
          created_at?: string;
          name: string;
          sku: string;
          price: number;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          category_id?: string | null;
          created_at?: string;
          name?: string;
          sku?: string;
          price?: number;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };

      // 6. Inventory (Store-Specific Stock)
      inventory: {
        Row: {
          id: string;
          store_id: string;
          product_id: string;
          stock_quantity: number;
          min_level: number;
          last_updated: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          product_id: string;
          stock_quantity: number;
          min_level: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          product_id?: string;
          stock_quantity?: number;
          min_level?: number;
          last_updated?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

/**
 * --- Front-End Types (Based on DB Schema, tailored for UI) ---
 */

// UI type for Store list/card
export type StoreData = Database["public"]["Tables"]["stores"]["Row"] & {
  // Adding a derived/mock field for compatibility with your existing UI
  totalItems: number;
};

// UI type for Product list/card (combining Product and Inventory details)
// We define a joined type for the front-end to simplify data representation.
export type Product = Database["public"]["Tables"]["products"]["Row"] & {
  // Fields that come from the inventory table
  stock: number;
  minLevel: number;
  price: number; // This will map to 'selling_price' or 'base_price'
  store_id: string;
  category: string; // This would typically be looked up by joining with categories table
  store: string; // This would typically be looked up by joining with stores table
};

/**
 * Represents the raw data needed to create a new business
 */
export type NewBusinessData = {
  name: string;
  slug: string;
  owner_id: string;
};

/**
 * Represent the expected return type for a intities row
 */
export type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

// New type for the insert payload, used in the Server Action
export type NewCategory = Database["public"]["Tables"]["categories"]["Insert"];
