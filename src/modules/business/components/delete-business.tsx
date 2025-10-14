import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BusinessRow } from "@/types/stores.type";
import { toast } from "sonner";
import { deleteBusiness } from "@/app/(private)/business/actions/deleteBusiness";
import { useBusinessStore } from "@/store/useBusinessStore";

interface DeleteBusinessDialogProps {
  business: BusinessRow;
  children: React.ReactNode; // The button that triggers the dialog
}

/**
 * A confirmation dialog for securely deleting a business.
 * Calls the server action only after user confirmation.
 */
export function DeleteBusinessDialog({
  business,
  children,
}: DeleteBusinessDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refetchData = useBusinessStore((state) => state.refetchData);

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToastId = toast.loading(`Deleting ${business.name}...`);

    try {
      // The database handles the cascade due to ON DELETE CASCADE constraints.
      const response = await deleteBusiness(business);

      if (response.success) {
        toast.success(
          `SUCCESS: ${business.name} and all associated data deleted.`,
          {
            id: loadingToastId,
          }
        );
        setOpen(false); // Close dialog on success
        await refetchData();
      } else {
        // Display the specific error message from the Server Action
        toast.error(`ERROR: ${response.error}`, { id: loadingToastId });
      }
    } catch (err) {
      // Catch unexpected network/JS errors
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(
        `ERROR: Failed to delete ${business.name}. Details: ${errorMessage}`,
        { id: loadingToastId }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Permanent Deletion Confirmation</DialogTitle>
          <DialogDescription>
            Are you absolutely sure you want to delete the business &quot;
            <span className="font-semibold text-red-500">{business.name}</span>
            &quot;?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-red-600">
            This action is irreversible. All associated stores, categories, and
            products will be permanently removed.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
