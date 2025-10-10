"use client";
import React, { useState, useEffect } from "react"; // Added useEffect

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { List, LayoutGrid, PlusCircle } from "lucide-react";
import { initialNavData } from "@/mock/initialNavData";
import ProductCard from "@/modules/products/ui/product-card";
import ProductTable from "@/modules/products/ui/product-table";
import AddProductForm from "@/modules/products/ui/add-product-form";
import { useParams } from "next/navigation";
import { useStore } from "@/components/store-wrapper"; // Import useStore
import { getProductFormData } from "@/lib/data/product-form-data"; // Import the data fetcher
import { Database, Product } from "@/types/stores.type";
import { Skeleton } from "@/components/ui/skeleton";

// Define the types for fetched data
type StoreRow = Database["public"]["Tables"]["stores"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

// --- Mock Data (Keep for UI while loading) ---

export default function ProductsDetail() {
  const path = useParams();
  const { businessId, isLoading: isStoreLoading } = useStore(); // Get businessId from context

  const [view, setView] = useState("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New state for dynamic form data
  const [availableStores, setAvailableStores] = useState<StoreRow[]>([]);
  const [availableCategories, setAvailableCategories] = useState<CategoryRow[]>(
    []
  );
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch store and category data when businessId is available
  useEffect(() => {
    async function fetchFormData() {
      if (!businessId) {
        // This handles the state where the store/business is loading or not found.
        setIsDataLoading(false);
        return;
      }
      setIsDataLoading(true);

      try {
        // Call the server action to fetch data
        const { stores, categories } = await getProductFormData(businessId);

        if (stores) setAvailableStores(stores);
        if (categories) setAvailableCategories(categories);
      } catch (error) {
        console.error("Failed to fetch product form data:", error);
      } finally {
        setIsDataLoading(false);
      }
    }

    // Only run if businessId is available and store is done loading
    if (!isStoreLoading) {
      fetchFormData();
    }
  }, [businessId, isStoreLoading]); // Re-run when businessId changes

  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = (productData: ProductFormData) => {
    // In a real implementation:
    // 1. Find category_id and store_id from fetched data using names/values.
    // 2. Perform supabase insert/update for `products` and `inventory` tables.
    // 3. Refetch the product list.

    if (editingProduct) {
      // Update existing product mock
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...productData } : p
        )
      );
    } else {
      // Add new product mock
      const newProduct: Product = {
        // Mocked product details
        ...productData,
        id: `PROD-${Date.now()}`,
        sku: `SKU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        imageUrl: "https://placehold.co/100x100/EBF5FF/3B82F6?text=New",
        // Using form data fields for the front-end Product type
        category: productData.category_name,
        store: productData.store_name,
        // Mock IDs until real Supabase implementation is done
        store_id: "mock-new-store-id",
        base_price: productData.price,
      };
      setProducts([newProduct, ...products]);
    }
    setIsDialogOpen(false);
  };

  const showLoading = isStoreLoading || isDataLoading;

  if (showLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-8 w-full max-w-sm" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Handle case where business is loaded but has no stores/categories
  const canAddProduct =
    availableStores.length > 0 && availableCategories.length > 0;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{path.slug}</h1>
          <p className="text-muted-foreground">
            Manage your {path.slug} catalog and inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canAddProduct ? (
            <Button onClick={handleOpenAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          ) : (
            <Button disabled className="cursor-not-allowed">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          )}
        </div>
      </div>

      {!canAddProduct && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-lg">
          <p className="font-semibold">Setup Required</p>
          <p className="text-sm">
            You must add at least one store and one category to add a product.
          </p>
        </div>
      )}

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Input placeholder="Search products..." className="max-w-sm" />
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => {
            if (value) setView(value);
          }}
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Main Content */}
      <div>
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleOpenEditDialog}
              />
            ))}
          </div>
        ) : (
          <ProductTable products={products} />
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add a New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update the details for this item."
                : "Fill in the details to add a new item."}
            </DialogDescription>
          </DialogHeader>
          {/* Pass fetched data to the form */}
          <AddProductForm
            initialData={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => setIsDialogOpen(false)}
            availableStores={availableStores}
            availableCategories={availableCategories}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
