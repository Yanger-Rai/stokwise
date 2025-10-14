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
  // --- Fields needed for products table lookup (IDs derived from these names) ---
  category_name: string;
  store_name: string;

  // --- Fields needed for products table insertion ---
  sku: string; // SKU is part of the product definition
  price: number; // Base price for the product definition

  // --- Fields needed for inventory table insertion/update ---
  stock: number; // Maps to inventory.stock_quantity
  minLevel: number; // Maps to inventory.min_level
};
