"use client";

import { Users, TrendingUp, MapPin, Inbox } from "lucide-react";
import {
    useGetAnalyticsQuery,
    useGetEnquiriesQuery,
} from "../../store/api";

export default function AdminDashboard() {
    const { data: analyticsResponse, isLoading: analyticsLoading } = useGetAnalyticsQuery();
    const { data: enquiriesResponse, isLoading: enquiriesLoading } = useGetEnquiriesQuery();

    const analytics = analyticsResponse?.data;
    const enquiries = enquiriesResponse?.data ?? [];

    const stats = [
        {
            label: "Categories",
            value: analytics?.categories ?? 0,
            icon: MapPin,
            color: "text-[#00843d]",
            bg: "bg-green-50",
        },
        {
            label: "Destinations",
            value: analytics?.destinations ?? 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Packages",
            value: analytics?.packages ?? 0,
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            label: "Enquiries",
            value: analytics?.enquiries ?? 0,
            icon: Inbox,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            label: "Contacts",
            value: analytics?.contacts ?? 0,
            icon: Inbox,
            color: "text-pink-600",
            bg: "bg-pink-50",
        },
        {
            label: "Newsletter",
            value: analytics?.newsletter ?? 0,
            icon: Inbox,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">Welcome back, Admin!</h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Here's what happening with TGHE today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(analyticsLoading ? (Array.from({ length: 6 }).map(() => null) as null[]) : stats).map((stat, index) => (
                    <div
                        key={stat ? stat.label : index}
                        className="group rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 transition-all hover:shadow-md"
                    >
                        {stat ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className={`rounded-xl ${stat.bg} dark:bg-opacity-10 ${stat.color} p-3`}>
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {stat.label}
                                    </h3>
                                    <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 w-8 rounded-xl bg-gray-100 dark:bg-gray-700" />
                                <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                                <div className="h-6 w-16 rounded bg-gray-100 dark:bg-gray-700" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Recent Enquiries Table */}
                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">Recent Enquiries</h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {enquiries.length} total
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-gray-700">
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Name</th>
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Email</th>
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Package</th>
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Tour Date</th>
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Enquiry Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                {enquiriesLoading ? (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            <td className="py-3">
                                                <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                                            </td>
                                            <td className="py-3">
                                                <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-700" />
                                            </td>
                                            <td className="py-3">
                                                <div className="h-4 w-28 rounded bg-gray-100 dark:bg-gray-700" />
                                            </td>
                                            <td className="py-3">
                                                <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-700" />
                                            </td>
                                            <td className="py-3">
                                                <div className="h-4 w-28 rounded bg-gray-100 dark:bg-gray-700" />
                                            </td>
                                        </tr>
                                    ))
                                ) : enquiries.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
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
                                        .slice(0, 10)
                                        .map((enquiry) => (
                                            <tr
                                                key={enquiry._id}
                                                className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <td className="py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                                    {enquiry.name}
                                                </td>
                                                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {enquiry.email}
                                                </td>
                                                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {enquiry.packageName ?? "-"}
                                                </td>
                                                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {enquiry.tourDate
                                                        ? new Date(enquiry.tourDate).toLocaleDateString()
                                                        : "-"}
                                                </td>
                                                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(enquiry.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Chart Placeholder - Commented out as requested */}
                {/* 
                <div className="rounded-2xl bg-[#ff4106] p-8 shadow-lg shadow-[#ff4106]/20 flex flex-col justify-between text-white">
                    <div>
                        <h2 className="text-xl font-black">Generate Report</h2>
                        <p className="mt-2 text-sm text-white/80 leading-relaxed font-medium">
                            Create a comprehensive PDF report of all activities for this month with one click.
                        </p>
                    </div>
                    <button className="mt-8 w-full rounded-xl bg-white py-3.5 text-sm font-black uppercase tracking-widest text-[#ff4106] transition-transform hover:scale-[1.02] active:scale-95">
                        Download PDF
                    </button>
                </div>
                */}
            </div>
        </div>
    );
}
