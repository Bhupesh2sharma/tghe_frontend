"use client";

import { useState } from "react";
import {
  useGetInclusionExclusionSetsQuery,
  useCreateInclusionExclusionSetMutation,
  useUpdateInclusionExclusionSetMutation,
  useDeleteInclusionExclusionSetMutation,
} from "../../../store/api";
import type { InclusionExclusionSet, InclusionExclusionItem } from "../../../store/api";

export default function AdminInclusionExclusionSetsPage() {
  const { data, isLoading } = useGetInclusionExclusionSetsQuery();
  const [createSet, { isLoading: isCreating }] = useCreateInclusionExclusionSetMutation();
  const [updateSet, { isLoading: isUpdating }] = useUpdateInclusionExclusionSetMutation();
  const [deleteSet, { isLoading: isDeleting }] = useDeleteInclusionExclusionSetMutation();

  const list = data?.data ?? [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [items, setItems] = useState<{ type: "inclusion" | "exclusion"; text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (s: InclusionExclusionSet) => {
    setEditingId(s._id);
    setName(s.name);
    setItems(
      (s.items ?? []).map((i) => ({ type: i.type as "inclusion" | "exclusion", text: i.text }))
    );
    setError(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setItems([]);
    setError(null);
  };

  const addItem = (type: "inclusion" | "exclusion") => {
    setItems((prev) => [...prev, { type, text: "" }]);
  };

  const updateItem = (index: number, text: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text };
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    const validItems: Partial<InclusionExclusionItem>[] = items
      .filter((i) => i.text.trim())
      .map((i, idx) => ({ type: i.type, text: i.text.trim(), order: idx }));
    try {
      if (editingId) {
        await updateSet({
          id: editingId,
          body: { name: name.trim(), items: validItems as InclusionExclusionItem[] },
        }).unwrap();
      } else {
        await createSet({
          name: name.trim(),
          items: validItems as InclusionExclusionItem[],
        }).unwrap();
      }
      resetForm();
    } catch (err: unknown) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ?? "Unable to save."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this set?")) return;
    setError(null);
    try {
      await deleteSet(id).unwrap();
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
          Inclusion / Exclusion sets
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create reusable inclusion & exclusion lists. Select one when creating a package.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 lg:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            {editingId ? "Edit set" : "Create set"}
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
                placeholder="e.g. Standard North East"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => addItem("inclusion")}
                  className="text-xs font-semibold text-green-600 hover:underline"
                >
                  + Inclusion
                </button>
                <button
                  type="button"
                  onClick={() => addItem("exclusion")}
                  className="text-xs font-semibold text-orange-600 hover:underline"
                >
                  + Exclusion
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-2"
                  >
                    <span
                      className={`shrink-0 text-[10px] font-bold uppercase ${
                        item.type === "inclusion" ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {item.type}
                    </span>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateItem(i, e.target.value)}
                      placeholder="Item text"
                      className="flex-1 rounded border border-gray-200 dark:border-gray-700 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-red-600 text-xs shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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
            Existing sets
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-3 pr-3 text-left text-[11px] font-bold uppercase text-gray-400">Name</th>
                  <th className="pb-3 pr-3 text-left text-[11px] font-bold uppercase text-gray-400">Items</th>
                  <th className="pb-3 text-right text-[11px] font-bold uppercase text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  <tr><td colSpan={3} className="py-4 text-center text-gray-500">Loading...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={3} className="py-6 text-center text-gray-500">No sets yet.</td></tr>
                ) : (
                  list.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                      <td className="py-3 pr-3 font-semibold text-gray-900 dark:text-white">{s.name}</td>
                      <td className="py-3 pr-3 text-gray-600 dark:text-gray-400">{s.items?.length ?? 0} items</td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleEdit(s)}
                          className="rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-[11px] font-semibold uppercase mr-2"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(s._id)}
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
