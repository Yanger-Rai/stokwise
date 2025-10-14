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
import React, { useState } from "react";

function ManageCategories() {
  const stores = useBusinessStore((state) => state.stores);

  const [newCategory, setNewCategory] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={stores.length !== 0 ? "outline" : "default"}>
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
            <Button onClick={() => {}}>Add</Button>
          </div>
        </div>
        {/* {error && (
          <p className="text-red-500 text-sm p-2 bg-red-900/10 rounded-lg">
            Error: {error}
          </p>
        )} */}
        <ScrollArea className="h-80 rounded-md border">
          {stores.length > 0 ? (
            <ul role="list" className="divide-y divide-muted">
              {stores.map((store) => (
                <li key={store.id} className="flex justify-between gap-x-6 p-3">
                  <div className="flex min-w-0 gap-x-4">
                    <p className="text-sm/6 font-semibold text-primary">
                      {store.name}
                    </p>
                  </div>
                  <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                    <Button
                      variant="destructive"
                      size={"icon"}
                      // onClick={() => handleDeleteCategory(store.id, store.name)}
                      // disabled={isPendingDelete && deletingId === store.id}
                    >
                      {/* {isPendingDelete && deletingId === store.id ? (
                        <Loader className=" animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )} */}
                      <span className="sr-only">Delete {store.name}</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2">
              <p className="text-muted-foreground text-center">
                You have no stores. Begin by clicking on the add button
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ManageCategories;
