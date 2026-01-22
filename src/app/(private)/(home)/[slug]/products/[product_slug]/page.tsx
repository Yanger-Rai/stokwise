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
import ProductCard from "@/modules/products/ui/product-card";
import ProductTable from "@/modules/products/ui/product-table";
import AddProductForm from "@/modules/products/ui/add-product-form";
import { useParams } from "next/navigation";
import { Database } from "@/types/stores.type";
import { Skeleton } from "@/components/ui/skeleton";
import { useBusinessStore } from "@/store/useBusinessStore";
import { fetchProductsByCategory } from "../actions/fetchProductsByCategory";
import { Product } from "@/types/product.type";

// Define the types for fetched data
type StoreRow = Database["public"]["Tables"]["stores"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

// --- Mock Data (Keep for UI while loading) ---

export default function ProductsDetail() {
  const path = useParams();
  // Zustand
  const stores = useBusinessStore((state) => state.stores);
  const categories = useBusinessStore((state) => state.categories);
  const currentBusiness = useBusinessStore((state) => state.currentBusiness);

  // Get the category ID from the URL params
  const categoryId = categories.find(
    (cat) => cat.name === path.product_slug
  )?.id;

  const [view, setView] = useState("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch store and category data when businessId is available
  useEffect(() => {
    async function fetchFormData() {
      if (!currentBusiness?.id || !categoryId) {
        setIsDataLoading(false);
        return;
      }
      setIsDataLoading(true);
      try {
        const result = await fetchProductsByCategory(
          currentBusiness.id,
          categoryId
        );
        if (result.success) {
          setProducts(result.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products by category:", error);
        setProducts([]);
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchFormData();
  }, [currentBusiness, categoryId]); // Re-run when businessId or categoryId changes

  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  if (isDataLoading) {
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

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {String(path.product_slug).toUpperCase()}
          </h1>
          <p className="text-muted-foreground">Manage inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

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
              <ProductCard key={product.id} product={product} />
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
            onSave={() => {}}
            onClose={() => setIsDialogOpen(false)}
            availableStores={stores}
            availableCategories={categories}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
