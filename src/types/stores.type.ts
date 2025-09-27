// --- NEW TYPES FOR STORE CARDS ---

/**
 * Represents the data for a single store location.
 */
export type StoreData = {
  id: string;
  name: string;
  location: string; // The physical location/address of the store
  totalItems: number; // Total unique products or stock count (mocked for now)
};

// --- END NEW TYPES ---

/**
 * Represents the full data structure for a single product in the inventory.
 */
export type Product = {
  id: string;
  name: string;
  category: string;
  store: string;
  sku: string;
  stock: number;
  minLevel: number;
  price: number;
  imageUrl: string;
};

/**
 * Represents the data needed to create or update a product.
 * It's the same as the Product type but without the system-generated 'id', 'sku', and 'imageUrl'.
 */
export type ProductFormData = Omit<Product, "id" | "sku" | "imageUrl">;
