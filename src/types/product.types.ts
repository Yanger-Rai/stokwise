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
