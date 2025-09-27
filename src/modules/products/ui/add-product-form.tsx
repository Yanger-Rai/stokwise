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
import { Product, ProductFormData } from "@/types/product.types";

interface AddProductFormProps {
  initialData?: Product | null;
  onSave: (productData: ProductFormData) => void;
  onClose: () => void;
}

function AddProductForm({ initialData, onSave, onClose }: AddProductFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [minLevel, setMinLevel] = useState(10);
  const [price, setPrice] = useState(0);
  const [store, setStore] = useState(""); // Added store

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setStore(initialData.store); // Added store
      setStock(initialData.stock);
      setMinLevel(initialData.minLevel);
      setPrice(initialData.price);
    } else {
      setName("");
      setCategory("");
      setStore(""); // Added store
      setStock(0);
      setMinLevel(10);
      setPrice(0);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !store) {
      alert("Please fill in Name, Category, and Store.");
      return;
    }
    onSave({ name, category, store, stock, minLevel, price });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category*
        </Label>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beverages">Beverages</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stock" className="text-right">
          Quantity
        </Label>
        <Input
          id="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          className="col-span-3"
        />
      </div>
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
        />
      </div>
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="store" className="text-right">
          Store*
        </Label>
        <Select onValueChange={setStore} value={store}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Store A">Store A</SelectItem>
            <SelectItem value="Store B">Store B</SelectItem>
            <SelectItem value="Store C">Store C</SelectItem>
          </SelectContent>
        </Select>
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
