"use client";

import { useGetContactsQuery } from "../../../store/api";

export default function AdminContactsPage() {
  const { data, isLoading } = useGetContactsQuery();
  const contacts = data?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Contacts
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View all contact form submissions from the website.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            All Contacts
          </h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {contacts.length} total
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
                  Adults
                </th>
                <th className="pb-3 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Children
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
                      <div className="h-4 w-10 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="py-3 pr-3">
                      <div className="h-4 w-10 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="py-3 pr-3">
                      <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-700" />
                    </td>
                  </tr>
                ))
              ) : contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No contacts yet.
                  </td>
                </tr>
              ) : (
                contacts
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((contact) => (
                    <tr key={contact._id} className="align-top hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                      <td className="py-3 pr-3 text-sm font-semibold text-gray-900 dark:text-white">
                        {contact.name}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {contact.email}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {contact.phone}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {contact.noOfAdults ?? 0}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400">
                        {contact.noOfChildren ?? 0}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        {contact.message ?? "-"}
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(contact.createdAt).toLocaleString()}
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

