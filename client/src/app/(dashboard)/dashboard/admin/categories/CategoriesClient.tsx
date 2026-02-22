"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  FolderPlus,
  Info,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DataTable } from "@/components/shared/DataTable";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/admin/hooks/useCategories";
import { Category } from "@/features/admin/services/category.service";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

const AdminCategories = () => {
  const {
    categories,
    isLoading,
    error,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    refetch,
  } = useCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  const openAdd = () => {
    setEditingId(null);
    form.reset({ name: "", slug: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    form.reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: CategoryForm) => {
    let success = false;
    if (editingId) {
      success = await handleUpdateCategory(editingId, data);
    } else {
      success = await handleCreateCategory(data);
    }
    if (success) {
      setDialogOpen(false);
    }
  };

  const autoSlug = () => {
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === "") {
      const nameValue = form.getValues("name");
      form.setValue(
        "slug",
        nameValue
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      );
    }
  };

  const columns = [
    {
      header: "Name",
      render: (cat: Category) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">{cat.name}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            ID: {cat.id}
          </div>
        </div>
      ),
    },
    {
      header: "Slug",
      render: (cat: Category) => (
        <Badge
          variant="secondary"
          className="bg-muted text-muted-foreground font-mono text-[10px] px-2 py-0.5 border-none"
        >
          {cat.slug}
        </Badge>
      ),
    },
    {
      header: "Description",
      render: (cat: Category) => (
        <p className="text-sm text-muted-foreground max-w-xs truncate">
          {cat.description || "No description"}
        </p>
      ),
    },
    {
      header: "Courses",
      thClassName: "text-right",
      className: "text-right",
      render: (cat: Category) => (
        <span className="font-bold text-sm tabular-nums text-foreground">
          {cat.courseCount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "",
      className: "w-24",
      render: (cat: Category) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEdit(cat)}
            className="h-8 w-8 rounded-lg hover:bg-muted"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(cat.id)}
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-bold">Error Loading Categories</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Category Management
              </h1>
              <Button
                onClick={() => refetch()}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                <RefreshCcw
                  className={isLoading ? "animate-spin w-4 h-4" : "w-4 h-4"}
                />
              </Button>
            </div>
            <p className="text-muted-foreground">
              Organize courses by managing global categories and tags.
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-6 shadow-sm shadow-primary/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Category
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          emptyState={{
            icon: FolderPlus,
            title: "No categories found",
            description: "Get started by creating your first course category.",
          }}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="rounded-2xl max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingId ? "Edit Category" : "New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update category details below."
                  : "Add a new course category."}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-4"
            >
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category Name
                </Label>
                <Input
                  {...form.register("name")}
                  placeholder="e.g. Web Development"
                  onBlur={autoSlug}
                  className="h-11 rounded-xl"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive font-medium">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  URL Slug
                </Label>
                <Input
                  {...form.register("slug")}
                  placeholder="e.g. web-development"
                  className="h-11 rounded-xl font-mono text-sm"
                />
                {form.formState.errors.slug && (
                  <p className="text-xs text-destructive font-medium">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Description (Optional)
                </Label>
                <Textarea
                  {...form.register("description")}
                  placeholder="Provide a brief description of what this category covers…"
                  rows={4}
                  className="rounded-xl resize-none"
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-destructive font-medium">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-xl h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl h-11 px-8 min-w-[140px]"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <RefreshCcw className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {editingId ? "Save Changes" : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
        >
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">
                Delete this category?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This action is permanent. Courses associated with this category
                will remain, but they will become uncategorized.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDeleteCategory(deleteId)}
                className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
              >
                Delete Category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
};

export default AdminCategories;
