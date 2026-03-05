"use client";

import { useState, useRef, useEffect } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryFormMutation,
  useUpdateCategoryFormMutation,
  useDeleteCategoryMutation,
} from "../../../store/api";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryFormMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryFormMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = data?.data ?? [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c._id === id);
    if (!category) return;
    setEditingId(id);
    setName(category.name ?? "");
    setTitle(category.title ?? "");
    setImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setTitle("");
    setImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    if (title.trim()) formData.append("title", title.trim());
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingId) {
        await updateCategory({ id: editingId, formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      resetForm();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string }; error?: string })?.data
          ?.message ||
        (err as { error?: string })?.error ||
        "Unable to save category. Please try again.";
      setError(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setError(null);
    try {
      await deleteCategory(id).unwrap();
      if (editingId === id) resetForm();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string }; error?: string })?.data
          ?.message ||
        (err as { error?: string })?.error ||
        "Unable to delete category. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Categories
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage experience categories used across packages.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 lg:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            {editingId ? "Edit Category" : "Create Category"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Name*
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-[#ff4106] focus:ring-1 focus:ring-[#ff4106]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-[#ff4106] focus:ring-1 focus:ring-[#ff4106]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-100"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                {editingId
                  ? "Choose a new image to replace the current one, or leave empty to keep it."
                  : "Choose an image (optional). JPEG, PNG, GIF, WebP; max 5MB."}
              </p>
              {(imagePreviewUrl || (editingId && categories.find((c) => c._id === editingId)?.image)) && (
                <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <img
                    src={imagePreviewUrl || categories.find((c) => c._id === editingId)?.image || ""}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {imageFile && !imagePreviewUrl && (
                <p className="text-xs text-[#00843d] dark:text-green-400">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#ff4106] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-sm transition hover:bg-[#e33904] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {editingId
                  ? isUpdating
                    ? "Saving..."
                    : "Save Changes"
                  : isCreating
                    ? "Creating..."
                    : "Create Category"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Existing Categories
            </h2>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {categories.length} total
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Name
                  </th>
                  <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Title
                  </th>
                  <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Image
                  </th>
                  <th className="pb-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="py-3 pr-3">
                        <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-700" />
                      </td>
                      <td className="py-3 pr-3">
                        <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-700" />
                      </td>
                      <td className="py-3 pr-3">
                        <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                      </td>
                      <td className="py-3 text-right">
                        <div className="ml-auto h-8 w-20 rounded-full bg-gray-100 dark:bg-gray-700" />
                      </td>
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No categories yet.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60"
                    >
                      <td className="py-3 pr-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {category.title ?? "-"}
                      </td>
                      <td className="py-3 pr-3">
                        {category.image ? (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(category._id)}
                            className="rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(category._id)}
                            className="rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
