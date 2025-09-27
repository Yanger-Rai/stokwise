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
import { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

function ProductCard({ product, onEdit }: ProductCardProps) {
  const [currentStock, setCurrentStock] = useState(product.stock);
  const isLowStock = currentStock <= product.minLevel;

  const handleStockUpdate = () => {
    console.log(`Updating stock for ${product.name} to ${currentStock}`);
    alert(
      `Stock for ${product.name} updated to ${currentStock}! (See console)`
    );
  };

  return (
    <Card className="flex flex-col cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Package2 className="h-12 w-12 text-cyan-600 rounded-lg bg-cyan-50 p-1" />
          {/* <img
            src={product.imageUrl}
            alt={product.name}
            className="h-12 w-12 object-contain rounded-lg bg-gray-100 p-1"
          /> */}
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
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
        <div className="flex items-center justify-between">
          <span className="text-sm">Min Level:</span>
          <span className="font-medium">{product.minLevel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Price:</span>
          <span className="font-medium">₹{product.price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/40 p-4">
        <div className="w-full flex items-center gap-2">
          <label
            htmlFor={`stock-${product.id}`}
            className="text-sm font-medium"
          >
            Total Stock:
          </label>
          <Input
            id={`stock-${product.id}`}
            type="number"
            value={currentStock}
            onChange={(e) => setCurrentStock(parseInt(e.target.value, 10) || 0)}
            className="h-8 w-20"
          />
          <Button size="icon" className="h-8 w-8" onClick={handleStockUpdate}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
