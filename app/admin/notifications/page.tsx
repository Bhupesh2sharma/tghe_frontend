"use client";

import { useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../../../store/api";

export default function AdminNotificationsPage() {
  const [showRead, setShowRead] = useState(false);
  const {
    data,
    isLoading,
    refetch,
  } = useGetNotificationsQuery({ read: showRead, limit: 50 });
  const [markAll, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();
  const [markOne, { isLoading: isMarkingOne }] =
    useMarkNotificationReadMutation();

  const notifications = data?.data ?? [];

  const handleMarkAll = async () => {
    try {
      await markAll().unwrap();
      refetch();
    } catch {
      // best-effort; errors are handled by default RTK Query logging
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await markOne(id).unwrap();
      refetch();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            System alerts for new enquiries, contacts, and newsletter signups.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowRead((prev) => !prev)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {showRead ? "Show Unread" : "Show Read"}
          </button>
          <button
            type="button"
            onClick={handleMarkAll}
            disabled={isMarkingAll || notifications.length === 0}
            className="rounded-xl bg-[#ff4106] px-3 py-2 text-xs font-black uppercase tracking-widest text-white shadow-sm transition hover:bg-[#e33904] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isMarkingAll ? "Marking..." : "Mark All Read"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {showRead ? "Read Notifications" : "Unread Notifications"}
          </h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {notifications.length} items
          </p>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40"
              >
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-700" />
                  <div className="h-3 w-64 rounded bg-gray-100 dark:bg-gray-700" />
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No notifications to display.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-[#ff4106]" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {notification.type}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </p>
                  {notification.link && (
                    <a
                      href={notification.link}
                      className="text-xs font-semibold text-[#ff4106] hover:underline"
                    >
                      View details
                    </a>
                  )}
                </div>
                {!notification.read && (
                  <button
                    type="button"
                    disabled={isMarkingOne}
                    onClick={() => handleMarkOne(notification._id)}
                    className="mt-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

