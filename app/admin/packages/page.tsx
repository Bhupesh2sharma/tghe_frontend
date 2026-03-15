"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  useGetPackagesQuery,
  useCreatePackageFormMutation,
  useUpdatePackageFormMutation,
  useAssignPackageCategoriesDestinationsMutation,
  useDeletePackageMutation,
  useGetCategoriesQuery,
  useGetDestinationsQuery,
  useGetItineraryTemplatesQuery,
  useGetInclusionExclusionSetsQuery,
  useGetPaymentRefundPolicyTemplatesQuery,
  useGetTermsConditionTemplatesQuery,
} from "../../../store/api";

export default function AdminPackagesPage() {
  const { data: packagesResponse, isLoading: packagesLoading } =
    useGetPackagesQuery();
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const { data: destinationsResponse } = useGetDestinationsQuery();
  const { data: itineraryTemplatesResponse } = useGetItineraryTemplatesQuery();
  const { data: inclusionExclusionSetsResponse } = useGetInclusionExclusionSetsQuery();
  const { data: paymentPoliciesResponse } = useGetPaymentRefundPolicyTemplatesQuery();
  const { data: termsTemplatesResponse } = useGetTermsConditionTemplatesQuery();

  const [createPackage, { isLoading: isCreating }] = useCreatePackageFormMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageFormMutation();
  const [assignPackageRelations, { isLoading: isAssigning }] = useAssignPackageCategoriesDestinationsMutation();
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();

  const packages = packagesResponse?.data ?? [];
  const categories = categoriesResponse?.data ?? [];
  const destinations = destinationsResponse?.data ?? [];
  const itineraryTemplates = itineraryTemplatesResponse?.data ?? [];
  const inclusionExclusionSets = inclusionExclusionSetsResponse?.data ?? [];
  const paymentPolicies = paymentPoliciesResponse?.data ?? [];
  const termsTemplates = termsTemplatesResponse?.data ?? [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [durationDescription, setDurationDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([]);
  const [selectedItineraryTemplateId, setSelectedItineraryTemplateId] = useState("");
  const [selectedInclusionExclusionSetId, setSelectedInclusionExclusionSetId] = useState("");
  const [selectedPaymentPolicyId, setSelectedPaymentPolicyId] = useState("");
  const [selectedTermsId, setSelectedTermsId] = useState("");
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

  const currentEditingPackage = useMemo(
    () => packages.find((p) => p._id === editingId),
    [editingId, packages]
  );

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setTitle("");
    setDuration("");
    setDurationDescription("");
    setDescription("");
    setImageFile(null);
    setImageFiles([]);
    setImagePreviewUrl(null);
    setSelectedCategoryIds([]);
    setSelectedDestinationIds([]);
    setSelectedItineraryTemplateId("");
    setSelectedInclusionExclusionSetId("");
    setSelectedPaymentPolicyId("");
    setSelectedTermsId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagesInputRef.current) imagesInputRef.current.value = "";
    setError(null);
  };

  const handleEdit = (id: string) => {
    const pkg = packages.find((p) => p._id === id);
    if (!pkg) return;
    setEditingId(id);
    setName(pkg.name ?? "");
    setTitle(pkg.title ?? "");
    setDuration(pkg.duration ?? "");
    setDurationDescription(pkg.durationDescription ?? "");
    setDescription(pkg.description ?? "");
    setImageFile(null);
    setImageFiles([]);
    setImagePreviewUrl(null);
    setSelectedCategoryIds(pkg.categories?.map((c) => c._id) ?? []);
    setSelectedDestinationIds(pkg.destinations?.map((d) => d._id) ?? []);
    const itId =
      typeof pkg.itineraryTemplate === "string"
        ? pkg.itineraryTemplate
        : ((pkg.itineraryTemplate as unknown as { _id?: string } | undefined)?._id ??
          "");
    const ieId =
      typeof pkg.inclusionExclusionSet === "string"
        ? pkg.inclusionExclusionSet
        : ((pkg.inclusionExclusionSet as unknown as { _id?: string } | undefined)
            ?._id ?? "");
    const ppId =
      typeof pkg.paymentRefundPolicyTemplate === "string"
        ? pkg.paymentRefundPolicyTemplate
        : ((pkg.paymentRefundPolicyTemplate as unknown as { _id?: string } | undefined)
            ?._id ?? "");
    const tcId =
      typeof pkg.termsConditionTemplate === "string"
        ? pkg.termsConditionTemplate
        : ((pkg.termsConditionTemplate as unknown as { _id?: string } | undefined)
            ?._id ?? "");
    setSelectedItineraryTemplateId(itId);
    setSelectedInclusionExclusionSetId(ieId);
    setSelectedPaymentPolicyId(ppId);
    setSelectedTermsId(tcId);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagesInputRef.current) imagesInputRef.current.value = "";
    setError(null);
  };

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Package name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    if (title.trim()) formData.append("title", title.trim());
    if (duration.trim()) formData.append("duration", duration.trim());
    if (durationDescription.trim()) formData.append("durationDescription", durationDescription.trim());
    if (description.trim()) formData.append("description", description.trim());
    if (imageFile) formData.append("image", imageFile);
    imageFiles.forEach((f) => formData.append("images", f));
    formData.append("itineraryTemplateId", selectedItineraryTemplateId);
    formData.append("inclusionExclusionSetId", selectedInclusionExclusionSetId);
    formData.append("paymentRefundPolicyTemplateId", selectedPaymentPolicyId);
    formData.append("termsConditionTemplateId", selectedTermsId);

    try {
      if (editingId) {
        const result = await updatePackage({ id: editingId, formData }).unwrap();
        setEditingId(result.data._id);
        setImageFiles([]);
        if (imagesInputRef.current) imagesInputRef.current.value = "";
      } else {
        const result = await createPackage(formData).unwrap();
        setEditingId(result.data._id);
        setImageFiles([]);
        if (imagesInputRef.current) imagesInputRef.current.value = "";
      }
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string }; error?: string })?.data?.message ||
        (err as { error?: string })?.error ||
        "Unable to save package. Please try again.";
      setError(msg);
    }
  };

  const handleSaveRelations = async () => {
    if (!editingId) {
      setError("Save basic package details first before assigning relations.");
      return;
    }
    setError(null);
    try {
      await assignPackageRelations({
        id: editingId,
        body: {
          categoryIds: selectedCategoryIds,
          destinationIds: selectedDestinationIds,
        },
      }).unwrap();
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        "Unable to assign categories/destinations. Please try again.";
      setError(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    setError(null);
    try {
      await deletePackage(id).unwrap();
      if (editingId === id) {
        resetForm();
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        "Unable to delete package. Please try again.";
      setError(msg);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleDestination = (id: string) => {
    setSelectedDestinationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Packages
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage tour packages and link them with categories and destinations.
        </p>
        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Create <strong>Itinerary templates</strong>, <strong>Inclusion/Exclusion sets</strong>, <strong>Payment policies</strong>, and <strong>Terms &amp; Conditions</strong> from the sidebar first. When creating or editing a package, select one of each from the dropdowns in the form.
        </p>
      </div>

      <div className="grid gap-8 2xl:grid-cols-3">
        <div className="space-y-6 2xl:col-span-1">
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              {editingId ? "Edit Package" : "Create Package"}
            </h2>

            <form onSubmit={handleSaveBasic} className="space-y-4">
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
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 6 Days / 5 Nights"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-[#ff4106] focus:ring-1 focus:ring-[#ff4106]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Duration description
                </label>
                <input
                  type="text"
                  value={durationDescription}
                  onChange={(e) => setDurationDescription(e.target.value)}
                  placeholder="e.g. Gangtok 4N + Lachung 1N"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-[#ff4106] focus:ring-1 focus:ring-[#ff4106]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                {(imagePreviewUrl || (editingId && currentEditingPackage?.image)) && (
                  <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <img
                      src={imagePreviewUrl || currentEditingPackage?.image || ""}
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
                  onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    if (files.length) setImageFiles((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                  className="block w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-100"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Up to 20 images. Shown on experience detail page.
                </p>
                {editingId && currentEditingPackage?.images?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {currentEditingPackage.images.slice(0, 6).map((url, i) => (
                      <div key={i} className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {currentEditingPackage.images.length > 6 && (
                      <span className="text-[11px] text-gray-500">+{currentEditingPackage.images.length - 6} more</span>
                    )}
                  </div>
                ) : null}
                {imageFiles.length > 0 && (
                  <p className="text-xs text-[#00843d] dark:text-green-400">
                    {imageFiles.length} new file(s) selected
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Select templates (create from sidebar first)
                </p>
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400">Itinerary template</label>
                  <select
                    value={selectedItineraryTemplateId}
                    onChange={(e) => setSelectedItineraryTemplateId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  >
                    <option value="">— None —</option>
                    {itineraryTemplates.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400">Inclusion / Exclusion set</label>
                  <select
                    value={selectedInclusionExclusionSetId}
                    onChange={(e) => setSelectedInclusionExclusionSetId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  >
                    <option value="">— None —</option>
                    {inclusionExclusionSets.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400">Payment & Refund policy</label>
                  <select
                    value={selectedPaymentPolicyId}
                    onChange={(e) => setSelectedPaymentPolicyId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  >
                    <option value="">— None —</option>
                    {paymentPolicies.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400">Terms & Conditions</label>
                  <select
                    value={selectedTermsId}
                    onChange={(e) => setSelectedTermsId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  >
                    <option value="">— None —</option>
                    {termsTemplates.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
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
                      : "Create Package"}
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

          <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Link Categories &amp; Destinations
            </h2>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Select a package from the table (click <strong>Edit</strong>), then choose related categories and
              destinations. In the form above, select an <strong>Itinerary template</strong>, <strong>Inclusion/Exclusion set</strong>, <strong>Payment policy</strong>, and <strong>Terms</strong> (create those from the sidebar first).
            </p>

            {!currentEditingPackage ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  No package selected
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Click <strong>Edit</strong> on a package in the table on the right to assign categories, destinations, and template (itinerary, inclusions, policy, terms).
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                  {currentEditingPackage.name}
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Categories
                    </h3>
                    <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-900/40">
                      {categories.length === 0 ? (
                        <p className="px-1 py-2 text-[11px] text-gray-500 dark:text-gray-400">
                          No categories yet.
                        </p>
                      ) : (
                        categories.map((category) => (
                          <label
                            key={category._id}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-gray-700 hover:bg-white dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            <input
                              type="checkbox"
                              className="h-3 w-3 rounded border-gray-300 text-[#ff4106] focus:ring-[#ff4106]"
                              checked={selectedCategoryIds.includes(category._id)}
                              onChange={() => toggleCategory(category._id)}
                            />
                            <span className="truncate">{category.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Destinations
                    </h3>
                    <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-900/40">
                      {destinations.length === 0 ? (
                        <p className="px-1 py-2 text-[11px] text-gray-500 dark:text-gray-400">
                          No destinations yet.
                        </p>
                      ) : (
                        destinations.map((destination) => (
                          <label
                            key={destination._id}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-gray-700 hover:bg-white dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            <input
                              type="checkbox"
                              className="h-3 w-3 rounded border-gray-300 text-[#ff4106] focus:ring-[#ff4106]"
                              checked={selectedDestinationIds.includes(
                                destination._id
                              )}
                              onChange={() => toggleDestination(destination._id)}
                            />
                            <span className="truncate">{destination.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAssigning}
                  onClick={handleSaveRelations}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                >
                  {isAssigning ? "Saving..." : "Save Relations"}
                </button>
              </>
            )}
          </div>

        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 2xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Existing Packages
            </h2>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {packages.length} total
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Image
                  </th>
                  <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Name
                  </th>
                  <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Duration
                  </th>
                  <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Categories
                  </th>
                  <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Destinations
                  </th>
                  <th className="pb-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {packagesLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="py-3 pr-3">
                        <div className="h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-700" />
                      </td>
                      <td className="py-3 pr-3">
                        <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-700" />
                      </td>
                      <td className="py-3 pr-3">
                        <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                      </td>
                      <td className="py-3 pr-3">
                        <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-700" />
                      </td>
                      <td className="py-3 pr-3">
                        <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-700" />
                      </td>
                      <td className="py-3 text-right">
                        <div className="ml-auto h-8 w-20 rounded-full bg-gray-100 dark:bg-gray-700" />
                      </td>
                    </tr>
                  ))
                ) : packages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No packages yet.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                      <td className="py-3 pr-3">
                        {pkg.image ? (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                            <img
                              src={pkg.image}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {pkg.name}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {pkg.duration ?? "-"}
                        {pkg.durationDescription ? (
                          <span className="block text-xs text-gray-500 dark:text-gray-500 mt-0.5">{pkg.durationDescription}</span>
                        ) : null}
                      </td>
                      <td className="py-3 pr-3 text-xs text-gray-600 dark:text-gray-400">
                        {pkg.categories && pkg.categories.length > 0
                          ? pkg.categories.map((c) => c.name).join(", ")
                          : "-"}
                      </td>
                      <td className="py-3 pr-3 text-xs text-gray-600 dark:text-gray-400">
                        {pkg.destinations && pkg.destinations.length > 0
                          ? pkg.destinations.map((d) => d.name).join(", ")
                          : "-"}
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(pkg._id)}
                            className="rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(pkg._id)}
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

