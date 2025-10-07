import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { PlusIcon, LockIcon, UnlockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming 'sonner' is installed and used for toasts
import { createSlug } from "@/lib/utils";
import { createNewBusiness } from "@/app/(private)/business/actions/createNewBusiness";

// Define the shape of the form data
interface FormData {
  name: string;
  slug: string;
}

// Define the shape of validation errors
interface FormErrors {
  name?: string;
  slug?: string;
  general?: string;
}

function NewBusiness() {
  const [formData, setFormData] = useState<FormData>({ name: "", slug: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugLocked, setIsSlugLocked] = useState(false);

  const router = useRouter();

  // Use a functional approach to update form data and clear specific field errors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let newSlug = formData.slug;

    // Handle auto-update or manual entry for slug
    if (id === "name") {
      if (!isSlugLocked) {
        newSlug = createSlug(value);
      }
    } else if (id === "slug") {
      // If the user manually types in the slug field, lock the auto-update feature.
      setIsSlugLocked(true);
      newSlug = value; // Use the user's input directly
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
      ...(id === "name" && !isSlugLocked && { slug: newSlug }),
      ...(id === "slug" && { slug: newSlug }),
    }));

    // Clear the error for the current field as the user types
    setErrors((prev) => ({ ...prev, [id]: undefined, general: undefined }));
  };

  // Function to manually toggle the slug lock
  const toggleSlugLock = () => {
    if (isSlugLocked) {
      // If unlocking, regenerate the slug from the current name
      setFormData((prev) => ({ ...prev, slug: createSlug(prev.name) }));
      setErrors((prev) => ({ ...prev, slug: undefined, general: undefined }));
    }
    setIsSlugLocked((prev) => !prev);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Business Name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    // Slug validation rules: Required, correct format
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug/URL is required.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug =
        "Invalid format. Use lowercase letters, numbers, and hyphens (e.g., my-new-business).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle the form submission (calls the server action)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrors((prev) => ({
        ...prev,
        general: "Please correct the errors before submitting.",
      }));
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear previous server errors

    try {
      const result = await createNewBusiness(formData);

      if (result && result.error) {
        // Handle server-side error (e.g., duplicate slug)
        setErrors({
          general: result.error,
          slug: "Please change this slug to be unique.",
        });
        // Add a toast for general server error if no specific field error is set
        if (!errors.slug) {
          toast.error("Error creating business", { description: result.error });
        }
      } else if (result && result.success) {
        // Success: Close the dialog
        handleDialogClose(false);

        // --- NEW: Trigger Toast on successful creation ---
        toast.success(`Business "${formData.name}" successfully created!`, {
          description: `ID: ${result.businessId}. Click the card to select it.`,
          duration: 5000,
        });
        // --- END NEW ---

        router.refresh();
      }
    } catch (error) {
      console.error("Client Error during Submission:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
      toast.error("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form state when dialog closes
      setFormData({ name: "", slug: "" });
      setErrors({});
      setIsSlugLocked(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> New Business
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Business</DialogTitle>
          <DialogDescription>
            Your business will have its own application and database.
          </DialogDescription>
        </DialogHeader>
        {errors.general && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Business Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="name">Business Name*</Label>
            <Input
              id="name"
              placeholder="e.g., Acme Corp."
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              className={
                errors.name ? "border-destructive ring-destructive" : ""
              }
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name}</p>
            )}
          </div>

          {/* Slug/URL Input with Visual Indicator */}
          <div className="grid gap-2">
            <Label htmlFor="slug">
              Unique URL Slug*
              <span className="text-muted-foreground ml-2 text-xs">
                (e.g., stokwise.app/
                <span className="font-semibold">
                  {formData.slug || "your-slug"}
                </span>
                )
              </span>
            </Label>
            <div className="relative flex items-center">
              <Input
                id="slug"
                placeholder="e.g., acme-corp"
                value={formData.slug}
                onChange={handleChange}
                // Visually disable the input if the slug is not locked (i.e., auto-updating)
                disabled={!isSlugLocked && !!formData.name.trim()}
                aria-invalid={!!errors.slug}
                className={
                  errors.slug ? "border-destructive ring-destructive" : ""
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-none text-muted-foreground hover:bg-transparent hover:text-primary disabled:pointer-events-auto disabled:opacity-100"
                onClick={toggleSlugLock}
                title={
                  isSlugLocked
                    ? "Unlock slug for manual entry"
                    : "Lock slug to keep current value"
                }
              >
                {isSlugLocked ? (
                  <UnlockIcon className="size-4 text-primary" />
                ) : (
                  <LockIcon className="size-4" />
                )}
              </Button>
            </div>
            {errors.slug && (
              <p className="text-destructive text-xs">{errors.slug}</p>
            )}
            {!isSlugLocked && formData.name.trim() && !errors.slug && (
              <p className="text-muted-foreground text-xs flex items-center gap-1">
                <LockIcon className="size-3" />
                Auto-updating from Business Name. Click the lock icon to
                override.
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create New Business"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewBusiness;
