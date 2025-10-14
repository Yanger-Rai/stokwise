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
  const [categoryName, setCategoryName] = useState(""); // Maps to category_name
  const [storeName, setStoreName] = useState(""); // Maps to store_name
  const [stock, setStock] = useState(0);
  const [minLevel, setMinLevel] = useState(10);
  // Renamed from sellingPrice/basePrice to just price
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSku(initialData.sku);
      setCategoryName(initialData.category); // Using denormalized name
      setStoreName(initialData.store); // Using denormalized name
      setStock(initialData.stock);
      setMinLevel(initialData.minLevel);
      setPrice(initialData.price); // Now using the single price field
    } else {
      setName("");
      setSku("");
      setCategoryName("");
      setStoreName("");
      setStock(0);
      setMinLevel(10);
      setPrice(0);
    }
  }, [initialData]);

  // Auto-generate SKU when name changes for new products
  useEffect(() => {
    if (!initialData && name.trim().length > 0) {
      setSku(createSlug(name).toUpperCase());
    }
  }, [name, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryName || !storeName || !sku) {
      // Use toast instead of alert per instructions
      console.error("Please fill in Name, SKU, Category, and Store.");
      return;
    }

    const productData: ProductFormData = {
      name,
      sku,
      category_name: categoryName,
      store_name: storeName,
      stock,
      minLevel,
      price: price,
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
        <Select onValueChange={setCategoryName} value={categoryName}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
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
        <Select onValueChange={setStoreName} value={storeName}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            {availableStores.map((store) => (
              <SelectItem key={store.id} value={store.name}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Input (formerly Selling Price) */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Price (₹)
        </Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="col-span-3"
          placeholder="e.g., 199.99"
        />
      </div>

      {/* Stock Quantity Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stock" className="text-right">
          Initial Stock
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
