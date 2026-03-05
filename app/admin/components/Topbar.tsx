import { Bell, Search, Menu, Sun, Moon } from "lucide-react";
import { useGetUnreadNotificationsCountQuery } from "../../../store/api";

interface TopbarProps {
    onMenuClick: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export default function Topbar({ onMenuClick, isDarkMode, onToggleTheme }: TopbarProps) {
    const { data } = useGetUnreadNotificationsCountQuery();
    const unreadCount = data?.data?.count ?? 0;

    return (
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-white/80 dark:bg-gray-900/80 px-6 backdrop-blur-md lg:px-10 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                >
                    <Menu size={24} />
                </button>

                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        className="h-11 w-64 rounded-xl bg-gray-50 dark:bg-gray-800 pl-11 pr-4 text-sm outline-none ring-1 ring-gray-200 dark:ring-gray-700 transition-all focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-[#ff4106]/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleTheme}
                    className="rounded-xl p-2.5 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="relative rounded-xl p-2.5 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ff4106] px-1 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>

                <div className="h-10 w-[1px] bg-gray-100 dark:bg-gray-800 mx-2" />

                <div className="flex flex-col items-end text-right hidden xs:flex">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Dashboard</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Main Overview</span>
                </div>
            </div>
        </header>
    );
}
