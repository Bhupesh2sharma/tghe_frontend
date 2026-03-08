"use client";

import { useState, useRef, useEffect } from "react";
import {
  useGetDestinationsQuery,
  useCreateDestinationFormMutation,
  useUpdateDestinationFormMutation,
  useDeleteDestinationMutation,
} from "../../../store/api";

export default function AdminDestinationsPage() {
  const { data, isLoading } = useGetDestinationsQuery();
  const [createDestination, { isLoading: isCreating }] =
    useCreateDestinationFormMutation();
  const [updateDestination, { isLoading: isUpdating }] =
    useUpdateDestinationFormMutation();
  const [deleteDestination, { isLoading: isDeleting }] =
    useDeleteDestinationMutation();

  const destinations = data?.data ?? [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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
    const destination = destinations.find((d) => d._id === id);
    if (!destination) return;
    setEditingId(id);
    setName(destination.name ?? "");
    setDetails(destination.details ?? "");
    setImageFile(null);
    setImageFiles([]);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagesInputRef.current) imagesInputRef.current.value = "";
    setError(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDetails("");
    setImageFile(null);
    setImageFiles([]);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagesInputRef.current) imagesInputRef.current.value = "";
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
    if (details.trim()) formData.append("details", details.trim());
    if (imageFile) formData.append("image", imageFile);
    imageFiles.forEach((f) => formData.append("images", f));

    try {
      if (editingId) {
        await updateDestination({ id: editingId, formData }).unwrap();
      } else {
        await createDestination(formData).unwrap();
      }
      resetForm();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string }; error?: string })?.data
          ?.message ||
        (err as { error?: string })?.error ||
        "Unable to save destination. Please try again.";
      setError(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this destination?")) return;
    setError(null);
    try {
      await deleteDestination(id).unwrap();
      if (editingId === id) resetForm();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string }; error?: string })?.data
          ?.message ||
        (err as { error?: string })?.error ||
        "Unable to delete destination. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Destinations
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage destinations associated with tour packages.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 lg:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            {editingId ? "Edit Destination" : "Create Destination"}
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
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-[#ff4106] focus:ring-1 focus:ring-[#ff4106] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Main Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-100"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                One image (optional). JPEG, PNG, GIF, WebP; max 5MB.
              </p>
              {(imagePreviewUrl || (editingId && destinations.find((d) => d._id === editingId)?.image)) && (
                <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <img
                    src={imagePreviewUrl || destinations.find((d) => d._id === editingId)?.image || ""}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Gallery Images (min 6 recommended)
              </label>
              <input
                ref={imagesInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                className="block w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-100"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Up to 20 images.
              </p>
              {imageFiles.length > 0 && (
                <p className="text-xs text-[#00843d] dark:text-green-400">
                  {imageFiles.length} file(s) selected
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
                    : "Create Destination"}
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
              Existing Destinations
            </h2>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {destinations.length} total
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
                    Details
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
                ) : destinations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No destinations yet.
                    </td>
                  </tr>
                ) : (
                  destinations.map((destination) => (
                    <tr
                      key={destination._id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60"
                    >
                      <td className="py-3 pr-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {destination.name}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                        {destination.details ?? "-"}
                      </td>
                      <td className="py-3 pr-3">
                        {destination.image ? (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                            <img
                              src={destination.image}
                              alt={destination.name}
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
                            onClick={() => handleEdit(destination._id)}
                            className="rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(destination._id)}
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
