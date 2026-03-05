"use client";

import { useGetEnquiriesQuery } from "../../../store/api";

export default function AdminEnquiriesPage() {
  const { data, isLoading } = useGetEnquiriesQuery();
  const enquiries = data?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Enquiries
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View all tour enquiries submitted from the website.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            All Enquiries
          </h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {enquiries.length} total
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
                  Email
                </th>
                <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Phone
                </th>
                <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Package
                </th>
                <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Tour Date
                </th>
                <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Message
                </th>
                <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Enquiry Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
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
                    <td className="py-3 pr-3">
                      <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="py-3 pr-3">
                      <div className="h-4 w-28 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="py-3 pr-3">
                      <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                  </tr>
                ))
              ) : enquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No enquiries yet.
                  </td>
                </tr>
              ) : (
                enquiries
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((enquiry) => (
                    <tr key={enquiry._id} className="align-top hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                      <td className="py-3 pr-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {enquiry.name}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {enquiry.email}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {enquiry.phone ?? "-"}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {enquiry.packageName ?? "-"}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {enquiry.tourDate
                          ? new Date(enquiry.tourDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        {enquiry.message ?? "-"}
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(enquiry.createdAt).toLocaleString()}
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

