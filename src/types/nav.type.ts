import type { LucideIcon } from "lucide-react";

/**
 * Represents a user in the application.
 */
export type User = {
  name: string;
  email: string;
  avatar: string;
};

/**
 * Represents a sub-item in the main navigation.
 */
export type NavSubItem = {
  title: string;
  url: string;
};

/**
 * Represents an item in the main navigation.
 */
export type NavMainItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

/**
 * Represents the entire navigation data structure.
 */
export type NavData = {
  user: User;
  navMain: NavMainItem[];
};

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
