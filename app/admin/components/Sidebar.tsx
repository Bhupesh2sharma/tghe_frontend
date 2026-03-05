"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/authSlice";
import {
    LayoutDashboard,
    Map,
    MapPin,
    CalendarDays,
    Inbox,
    Settings,
    X,
    ChevronRight,
    LogOut
} from "lucide-react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Inbox, label: "Notifications", href: "/admin/notifications" },
    { icon: Map, label: "Categories", href: "/admin/categories" },
    { icon: MapPin, label: "Destinations", href: "/admin/destinations" },
    { icon: CalendarDays, label: "Packages", href: "/admin/packages" },
    { icon: Inbox, label: "Enquiries", href: "/admin/enquiries" },
    { icon: Inbox, label: "Contacts", href: "/admin/contacts" },
    { icon: Inbox, label: "Newsletter", href: "/admin/newsletter" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onCollapse: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onCollapse }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const email = useAppSelector((state) => state.auth.email);

    const handleLogout = () => {
        dispatch(logout());
        if (typeof window !== "undefined") {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminEmail");
        }
        router.replace("/admin/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed left-0 top-0 z-50 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${isCollapsed ? "w-20" : "w-72"}
      `}>
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className={`flex h-20 items-center px-6 transition-all duration-300 ${isCollapsed ? "justify-center" : "justify-between"}`}>
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0">
                                <Image
                                    src="/logohimalaya.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            {!isCollapsed && (
                                <span className="text-sm font-black tracking-tight text-[#ff4106] whitespace-nowrap overflow-hidden">
                                    TGHE ADMIN
                                </span>
                            )}
                        </Link>
                        {!isCollapsed && (
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Collapse Toggle Button (Laptop only) */}
                    <button
                        onClick={onCollapse}
                        className="absolute -right-3 top-24 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 shadow-sm transition-transform hover:text-[#ff4106] lg:flex"
                        style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        <ChevronRight size={14} />
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 py-6">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={isCollapsed ? item.label : ""}
                                    className={`
                    group flex items-center rounded-xl p-3.5 text-sm font-semibold transition-all
                    ${isActive
                                            ? "bg-[#ff4106] text-white shadow-lg shadow-[#ff4106]/20"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#ff4106]"}
                    ${isCollapsed ? "justify-center" : "justify-between"}
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} className={`shrink-0 ${isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-[#ff4106]"}`} />
                                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className={`border-t border-gray-100 dark:border-gray-800 p-6 transition-all duration-300 ${isCollapsed ? "p-4 flex flex-col items-center gap-2" : "space-y-3"}`}>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#ff4106] font-bold">
                                B
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{email || "Admin"}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">Administrator</span>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Log out"
                        >
                            <LogOut size={20} className="shrink-0" />
                            {!isCollapsed && <span>Log out</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
