"use client";

import { useGetNewslettersQuery } from "../../../store/api";

export default function AdminNewsletterPage() {
  const { data, isLoading } = useGetNewslettersQuery();
  const items = data?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Newsletter Subscribers
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage and view all newsletter signups.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Subscribers
          </h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {items.length} total
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Email
                </th>
                <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Subscribed At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="py-3 pr-3">
                      <div className="h-4 w-56 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                items
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((item) => (
                    <tr key={item.email + item.createdAt} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                      <td className="py-3 pr-3 text-sm text-gray-900 dark:text-white">
                        {item.email}
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

