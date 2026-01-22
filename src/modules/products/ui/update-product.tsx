import { addProduct } from "@/app/(private)/(home)/[slug]/products/actions/addProduct";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit } from "lucide-react";
import React from "react";
import AddProductForm from "./add-product-form";
import { Button } from "@/components/ui/button";
import { useBusinessStore } from "@/store/useBusinessStore";

interface UpdateProductProps {
  product: any;
}

const UpdateProduct = ({ product }: UpdateProductProps) => {
  // Zustant
  const stores = useBusinessStore((state) => state.stores);
  const categories = useBusinessStore((state) => state.categories);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
          <SheetDescription>
            Update the details for {product.name}.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <AddProductForm
            initialData={product}
            onSave={async (productData) => {
              const result = await addProduct(productData);
            }}
            onClose={() => {}}
            availableStores={stores}
            availableCategories={categories}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateProduct;
