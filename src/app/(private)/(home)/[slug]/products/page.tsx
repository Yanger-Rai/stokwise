"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import ManageCategories from "@/modules/products/ui/manage-categories";
import ManageStores from "@/modules/products/ui/manage-stores";
import ProductCard from "@/modules/products/ui/product-card";
import ProductTable from "@/modules/products/ui/product-table";
import AddProductForm from "@/modules/products/ui/add-product-form";
import { addProduct } from "./actions/addProduct";
import { updateProduct } from "./actions/updateProduct";
import { Product } from "@/types/product.type";
import { useBusinessStore } from "@/store/useBusinessStore";

// --- MAIN PAGE COMPONENT ---

export default function ProductsPage() {
  // Zustant
  const stores = useBusinessStore((state) => state.stores);
  const categories = useBusinessStore((state) => state.categories);
  const currentBusiness = useBusinessStore((state) => state.currentBusiness);

  const [view, setView] = useState("grid");
  const [products, setProducts] = useState<Product[]>([]);
  // Fetch products using server action
  const fetchProducts = async () => {
    if (!currentBusiness?.id) {
      setProducts([]);
      return;
    }
    const { fetchProductsForBusiness } = await import(
      "./actions/fetchProducts"
    );
    const result = await fetchProductsForBusiness(currentBusiness.id);
    if (!result.success) {
      console.error("Failed to fetch products:", result.error);
      setProducts([]);
      return;
    }
    setProducts(result.products);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentBusiness?.id]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Showing your product catalog and inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ManageCategories />
          <ManageStores />
          <Button
            onClick={handleOpenAddDialog}
            disabled={categories.length === 0}
          >
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
              <ProductCard
                key={product.id}
                product={product}
                onDelete={(id) =>
                  setProducts((prev) => prev.filter((p) => p.id !== id))
                }
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
          <AddProductForm
            initialData={editingProduct}
            onSave={async (productData) => {
              let result;
              if (editingProduct) {
                result = await updateProduct(editingProduct.id, productData);
              } else {
                result = await addProduct(productData);
              }
              if (result.success) {
                fetchProducts();
                setIsDialogOpen(false);
              } else {
                alert(result.error);
              }
            }}
            onClose={() => setIsDialogOpen(false)}
            availableStores={stores}
            availableCategories={categories}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
