/**
 * Represents the full data structure for a single product in the inventory.
 * Note: This is an intersection of the 'products' and 'inventory' tables
 * to simplify client-side state management.
 */
export type Product = {
  id: string; // Product ID (from products table)
  name: string;
  category: string; // Category name (denormalized)
  store: string; // Store name (denormalized)
  store_id: string; // Store ID (from inventory table)
  category_id: string;
  sku: string;
  stock: number; // From inventory table (stock_quantity)
  minLevel: number; // From inventory table
  // price removed for inventory-only focus
  imageUrl: string | null; // From products table
};

/**
 * Represents the data needed to create or update a product.
 * Fields match the necessary input for the two tables (products & inventory).
 */
export type ProductFormData = {
  name: string;
  category_id: string;
  store_id: string;
  sku: string;
  stock: number;
  minLevel: number;
};
