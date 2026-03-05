"use client";

import { useState, useEffect } from "react";
import { Quicksand } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const quicksand = Quicksand({
    subsets: ["latin"],
    variable: "--font-quicksand",
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("admin-theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
        }
    }, []);

    // Auth guard & token rehydration for admin routes (except login)
    useEffect(() => {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
        const storedEmail = typeof window !== "undefined" ? localStorage.getItem("adminEmail") : null;
        const hasToken = token || storedToken;

        if (pathname === "/admin/login") {
            // If already logged in, redirect away from login to dashboard
            if (hasToken) {
                if (storedToken && !token) {
                    dispatch(setCredentials({ token: storedToken, email: storedEmail }));
                }
                router.replace("/admin");
            }
            setIsAuthChecked(true);
            return;
        }

        if (token) {
            setIsAuthChecked(true);
            return;
        }

        if (storedToken) {
            dispatch(setCredentials({ token: storedToken, email: storedEmail }));
            setIsAuthChecked(true);
        } else {
            router.replace("/admin/login");
        }
    }, [dispatch, pathname, router, token]);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        console.log("Switching theme to:", newTheme ? "dark" : "light");
        setIsDarkMode(newTheme);
        localStorage.setItem("admin-theme", newTheme ? "dark" : "light");
    };

    // Simple loading state while checking auth on protected routes
    if (pathname !== "/admin/login" && !isAuthChecked) {
        return (
            <div className={`${quicksand.className} ${isDarkMode ? "dark" : ""}`}>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Checking admin access...
                    </p>
                </div>
            </div>
        );
    }

    // Login page should not show sidebar/topbar shell
    if (pathname === "/admin/login") {
        return (
            <div className={`${quicksand.className} ${isDarkMode ? "dark" : ""}`}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${quicksand.className} ${isDarkMode ? "dark" : ""}`}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    isCollapsed={isCollapsed}
                    onCollapse={() => setIsCollapsed(!isCollapsed)}
                />

                <div className={`transition-all duration-300 ${isCollapsed ? "lg:pl-20" : "lg:pl-72"} flex flex-col min-h-screen`}>
                    <Topbar
                        onMenuClick={() => setSidebarOpen(true)}
                        isDarkMode={isDarkMode}
                        onToggleTheme={toggleTheme}
                    />

                    <main className="flex-1 p-6 lg:p-10">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
