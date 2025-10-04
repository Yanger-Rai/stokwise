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
  sku: string;
  stock: number; // From inventory table (stock_quantity)
  minLevel: number; // From inventory table
  price: number; // From inventory table (selling_price)
  imageUrl: string | null; // From products table
};

/**
 * Represents the data needed to create or update a product.
 * Fields match the necessary input for the two tables (products & inventory).
 */
export type ProductFormData = {
  name: string;
  category_name: string; // We'll need the category name to find/create the category_id
  store_name: string; // We'll need the store name to find the store_id
  stock: number;
  minLevel: number;
  price: number; // Selling price
};
