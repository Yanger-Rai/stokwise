"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Edit, Trash, Check, Package2 } from "lucide-react";

import { Product } from "@/types/product.type";
import UpdateProduct from "./update-product";
import { deleteProductById } from "@/app/(private)/(home)/[slug]/products/actions/deleteProduct";

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

function ProductCard({ product, onDelete }: ProductCardProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`
    );
    if (!confirmed) return;
    const result = await deleteProductById(product.id);
    if (result.success) {
      if (onDelete) onDelete(product.id);
    } else {
      alert(result.error || "Failed to delete product.");
    }
  };
  const [currentStock, setCurrentStock] = useState(product.stock);
  const isLowStock = currentStock <= product.minLevel;

  const handleStockUpdate = () => {
    console.log(`Updating stock for ${product.name} to ${currentStock}`);
    alert(
      `Stock for ${product.name} updated to ${currentStock}! (See console)`
    );
  };

  return (
    <Card className="flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Package2 className="h-12 w-12 text-cyan-600 rounded-lg bg-cyan-50 p-1" />
          {/* <img
            src={product.imageUrl}
            alt={product.name}
            className="h-12 w-12 object-contain rounded-lg bg-gray-100 p-1"
          /> */}
          <div className="flex gap-1">
            <UpdateProduct product={product} />
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="pt-2">{product.name}</CardTitle>
        <CardDescription>
          {product.category} - {product.store}
        </CardDescription>{" "}
        {/* Show store */}
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            SKU: {product.sku}
          </span>
          <Badge variant={isLowStock ? "destructive" : "secondary"}>
            {isLowStock ? "Low Stock" : "In Stock"}
          </Badge>
        </div>
        {/* <div className="flex items-center justify-between">
          <span className="text-sm">Min Level:</span>
          <span className="font-medium">{product.minLevel}</span>
        </div> */}
        {/* Price removed for inventory-only focus */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Current Stock:</span>
          <span className="font-medium">{product.stock}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
