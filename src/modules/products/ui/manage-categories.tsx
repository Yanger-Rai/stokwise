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
import { initialNavData } from "@/mock/initialNavData";
import { NavMainItem } from "@/types/nav.type";
import { Settings } from "lucide-react";
import { useState } from "react";

function ManageCategories({
  navConfig,
  setNavConfig,
}: {
  navConfig: typeof initialNavData;
  setNavConfig: React.Dispatch<React.SetStateAction<typeof initialNavData>>;
}) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const updatedNavMain = navConfig.navMain.map((item: NavMainItem) => {
      if (item.title === "Products") {
        const newSubItem = {
          title: newCategory,
          url: `/products/${newCategory.toLowerCase().replace(/\s+/g, "-")}`,
        };
        // Ensure items array exists
        const items = item.items || [];
        return { ...item, items: [...items, newSubItem] };
      }
      return item;
    });

    setNavConfig({ ...navConfig, navMain: updatedNavMain });
    setNewCategory(""); // Reset input
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
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
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
            />
            <Button onClick={handleAddCategory}>Add</Button>
          </div>
          {/* You can map and display existing categories here for deletion/editing */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageCategories;
