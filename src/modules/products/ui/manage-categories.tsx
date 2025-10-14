"use client";
import { addCategory } from "@/app/(private)/(home)/[slug]/products/actions/addCategory";
import { deleteCategory } from "@/app/(private)/(home)/[slug]/products/actions/deleteCategory";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Loader, Settings, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function ManageCategories() {
  const categories = useBusinessStore((state) => state.categories);
  const currentBusinessId = useBusinessStore(
    (state) => state.currentBusiness?.id
  );
  const fetchCategoriesData = useBusinessStore(
    (state) => state.fetchGlobalStoreCategories
  );

  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isPendingAdd, startTransitionAdd] = useTransition();
  const [isPendingDelete, startTransitionDelete] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = () => {
    // Clear previous error
    setError(null);

    if (!newCategory.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    if (!currentBusinessId) {
      setError("Could not find current business context. Cannot add category.");
      return;
    }

    startTransitionAdd(async () => {
      const result = await addCategory(newCategory.trim(), currentBusinessId);

      if (result.success) {
        // 1. Update local store state with the newly created category (including ID)
        if (result.category) {
          fetchCategoriesData(currentBusinessId);
        }

        // 2. Reset input
        setNewCategory("");
        toast.success(`SUCCESS: ${result.message}`);
      } else {
        // 3. Display error message
        setError(result.message);
        toast.error(`ERROR: ${result.message}`);
      }
    });
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    // Clear previous error
    setError(null);
    setDeletingId(categoryId);

    startTransitionDelete(async () => {
      const result = await deleteCategory(categoryId);
      setDeletingId(null);

      if (result.success && currentBusinessId) {
        // 1. Update local store state by removing the category
        fetchCategoriesData(currentBusinessId);
        toast.success(`SUCCESS: Deleted category ${categoryName}`);
      } else {
        // 2. Display error message
        setError(result.message);
        toast.error(
          `ERROR: Failed to delete category ${categoryName}: ${result.message}`
        );
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={categories.length !== 0 ? "outline" : "default"}>
          <Settings className="mr-2 h-4 w-4" /> Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add or manage your product categories. New categories will appear in
            the sidebar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name (e.g., Produce)"
              disabled={isPendingAdd}
            />
            <Button
              onClick={handleAddCategory}
              disabled={isPendingAdd || newCategory.trim().length === 0}
            >
              {isPendingAdd ? "Adding..." : "Add"}
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm p-2 bg-red-900/10 rounded-lg">
              Error: {error}
            </p>
          )}
          <ScrollArea className="h-80 rounded-md border">
            {categories.length > 0 ? (
              <ul role="list" className="divide-y divide-muted">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex justify-between gap-x-6 p-3"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <p className="text-sm/6 font-semibold text-primary">
                        {category.name}
                      </p>
                    </div>
                    <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                      <Button
                        variant="destructive"
                        size={"icon"}
                        onClick={() =>
                          handleDeleteCategory(category.id, category.name)
                        }
                        disabled={isPendingDelete && deletingId === category.id}
                      >
                        {isPendingDelete && deletingId === category.id ? (
                          <Loader className=" animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete {category.name}</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2">
                <p className="text-muted-foreground text-center">
                  You have no categories. Begin by adding your categories
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageCategories;
