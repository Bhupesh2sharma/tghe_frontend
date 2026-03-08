"use client";

import { useState } from "react";
import {
  useGetPaymentRefundPolicyTemplatesQuery,
  useCreatePaymentRefundPolicyTemplateMutation,
  useUpdatePaymentRefundPolicyTemplateMutation,
  useDeletePaymentRefundPolicyTemplateMutation,
} from "../../../store/api";
import type { PaymentRefundPolicyTemplate } from "../../../store/api";

export default function AdminPaymentPoliciesPage() {
  const { data, isLoading } = useGetPaymentRefundPolicyTemplatesQuery();
  const [createTemplate, { isLoading: isCreating }] = useCreatePaymentRefundPolicyTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdatePaymentRefundPolicyTemplateMutation();
  const [deleteTemplate, { isLoading: isDeleting }] = useDeletePaymentRefundPolicyTemplateMutation();

  const list = data?.data ?? [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (t: PaymentRefundPolicyTemplate) => {
    setEditingId(t._id);
    setName(t.name);
    setContent(t.content ?? "");
    setError(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setContent("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    try {
      if (editingId) {
        await updateTemplate({
          id: editingId,
          body: { name: name.trim(), content },
        }).unwrap();
      } else {
        await createTemplate({ name: name.trim(), content }).unwrap();
      }
      resetForm();
    } catch (err: unknown) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ?? "Unable to save."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this policy template?")) return;
    setError(null);
    try {
      await deleteTemplate(id).unwrap();
      if (editingId === id) resetForm();
    } catch (err: unknown) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ?? "Unable to delete."
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Payment & Refund policies
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create reusable cancellation & refund policy text. Select one when creating a package.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 lg:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            {editingId ? "Edit policy" : "Create policy"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                Name*
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Standard Cancellation"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm resize-y"
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 rounded-xl bg-[#ff4106] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white disabled:opacity-70"
              >
                {editingId ? (isUpdating ? "Saving..." : "Save") : isCreating ? "Creating..." : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-xs font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            Existing policies
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-3 pr-3 text-left text-[11px] font-bold uppercase text-gray-400">Name</th>
                  <th className="pb-3 text-right text-[11px] font-bold uppercase text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  <tr><td colSpan={2} className="py-4 text-center text-gray-500">Loading...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={2} className="py-6 text-center text-gray-500">No policies yet.</td></tr>
                ) : (
                  list.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                      <td className="py-3 pr-3 font-semibold text-gray-900 dark:text-white">{t.name}</td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleEdit(t)}
                          className="rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-[11px] font-semibold uppercase mr-2"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(t._id)}
                          className="rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-600"
                        >
                          Delete
                        </button>
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
