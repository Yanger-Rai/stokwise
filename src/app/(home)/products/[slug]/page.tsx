"use client";
import React from "react";
import { useState } from "react";
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
import { Product, ProductFormData } from "@/types/product.types";
import { initialNavData } from "@/mock/initialNavData";
import ProductCard from "@/modules/products/ui/product-card";
import ProductTable from "@/modules/products/ui/product-table";
import AddProductForm from "@/modules/products/ui/add-product-form";
import { useParams } from "next/navigation";

// --- MAIN PAGE COMPONENT ---

const initialProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Premium Coffee Beans",
    category: "Beverages",
    store: "Store A",
    sku: "COF-001",
    stock: 25,
    minLevel: 50,
    price: 25.99,
    imageUrl: "https://placehold.co/100x100/EBF5FF/3B82F6?text=☕️",
  },
  {
    id: "PROD-002",
    name: "Organic Tea Bags",
    category: "Beverages",
    store: "Store A",
    sku: "TEA-002",
    stock: 60,
    minLevel: 30,
    price: 15.49,
    imageUrl: "https://placehold.co/100x100/EBF5FF/3B82F6?text=🍵",
  },
  {
    id: "PROD-003",
    name: "Artisan Pastries",
    category: "Food",
    store: "Store B",
    sku: "PAS-003",
    stock: 8,
    minLevel: 20,
    price: 4.99,
    imageUrl: "https://placehold.co/100x100/EBF5FF/3B82F6?text=🥐",
  },
  {
    id: "PROD-004",
    name: "Ceramic Mugs",
    category: "Accessories",
    store: "Store B",
    sku: "MUG-004",
    stock: 32,
    minLevel: 15,
    price: 12.0,
    imageUrl: "https://placehold.co/100x100/EBF5FF/3B82F6?text=Mug",
  },
];

export default function ProductsDetail() {
  const path = useParams();
  const [view, setView] = useState("grid");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [navConfig, setNavConfig] = useState(initialNavData);

  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = (productData: ProductFormData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...productData } : p
        )
      );
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: `PROD-${Date.now()}`,
        sku: `SKU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        imageUrl: "https://placehold.co/100x100/EBF5FF/3B82F6?text=New",
      };
      setProducts([newProduct, ...products]);
    }
    setIsDialogOpen(false);
  };

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
          <AddProductForm
            initialData={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
