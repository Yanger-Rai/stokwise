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
import { NavData, NavMainItem } from "@/types/nav.type";
import { Settings } from "lucide-react";
import React, { useState } from "react";

function ManageCategories({
  navConfig,
  setNavConfig,
}: {
  navConfig: NavData;
  setNavConfig: React.Dispatch<React.SetStateAction<NavData>>;
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
          <Settings className="mr-2 h-4 w-4" /> Manage Stores
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Stores</DialogTitle>
          <DialogDescription>
            Add or manage your Stores/Branches. New Store/Branch will appear in
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageCategories;
