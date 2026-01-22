import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, ProductFormData } from "@/types/product.type"; // Corrected import from .types to .type
import { CategoryRow, StoreData } from "@/types/stores.type";
import { createSlug } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface AddProductFormProps {
  initialData?: Product | null;
  onSave: (productData: ProductFormData) => void;
  onClose: () => void;
  // Added available lists for dynamic selectors
  availableStores: StoreData[];
  availableCategories: CategoryRow[];
}

function AddProductForm({
  initialData,
  onSave,
  onClose,
  availableStores,
  availableCategories,
}: AddProductFormProps) {
  // State for fields in the ProductFormData structure
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Maps to category_id
  const [storeId, setStoreId] = useState(""); // Maps to store_id
  const [stock, setStock] = useState(0);
  const [minLevel, setMinLevel] = useState(10);

  useEffect(() => {
    console.log(initialData);
    if (initialData) {
      setName(initialData.name);
      setSku(initialData.sku);
      setCategoryId(initialData.category_id);
      setStoreId(initialData.store_id);
      setStock(initialData.stock);
      setMinLevel(initialData.minLevel);

      // Debug: Check if IDs match available options
      const catMatch = availableCategories.some(
        (cat) => cat.id === initialData.category_id
      );
      const storeMatch = availableStores.some(
        (store) => store.id === initialData.store_id
      );
      if (!catMatch) {
        console.warn(
          "Category ID not found in availableCategories:",
          initialData.category_id,
          availableCategories
        );
      }
      if (!storeMatch) {
        console.warn(
          "Store ID not found in availableStores:",
          initialData.store_id,
          availableStores
        );
      }
    } else {
      setName("");
      setSku("");
      setCategoryId("");
      setStoreId("");
      setStock(0);
      setMinLevel(10);
    }
  }, [initialData, availableCategories, availableStores]);

  // Auto-generate SKU when name changes for new products
  useEffect(() => {
    if (name.trim().length > 0) {
      setSku(createSlug(name).toUpperCase());
    }
  }, [name, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !storeId || !sku) {
      console.error("Please fill in Name, SKU, Category, and Store.");
      return;
    }

    const productData: ProductFormData = {
      name,
      sku,
      category_id: categoryId,
      store_id: storeId,
      stock,
      minLevel,
    };

    onSave(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {/* Product Name Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name*
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3"
          placeholder="e.g., Premium Coffee Beans"
        />
      </div>

      {/* SKU Input (Auto-filled on new product, editable) */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="sku" className="text-right">
          SKU*
        </Label>
        <Input
          id="sku"
          disabled={true}
          value={sku}
          onChange={(e) => setSku(e.target.value.toUpperCase())}
          className="col-span-3"
          placeholder="e.g., COF-BNS-001"
        />
      </div>

      {/* Category Select */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category*
        </Label>
        <Select
          onValueChange={setCategoryId}
          value={initialData?.category_id || categoryId}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Store Select */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="store" className="text-right">
          Store*
        </Label>
        <Select
          onValueChange={setStoreId}
          value={initialData?.store_id || storeId}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            {availableStores.map((store) => (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* INVENTORY INFO */}
      <Separator className="my-4" />

      {/* Stock Quantity Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stock" className="text-right">
          Current Stock
        </Label>
        <Input
          id="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          className="col-span-3"
          min="0"
        />
      </div>

      {/* Min Level Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="minLevel" className="text-right">
          Min. Level
        </Label>
        <Input
          id="minLevel"
          type="number"
          value={minLevel}
          onChange={(e) => setMinLevel(parseInt(e.target.value) || 0)}
          className="col-span-3"
          min="0"
        />
      </div>

      <Separator className="my-4" />

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}

export default AddProductForm;
